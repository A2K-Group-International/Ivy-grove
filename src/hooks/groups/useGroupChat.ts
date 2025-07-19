import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  insertMessage,
  loadMessages,
  type GroupChatMessage,
} from "@/services/groupMessages.services";

interface UseGroupChatProps {
  groupId: string;
}

export function useGroupChat({ groupId }: UseGroupChatProps) {
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use refs to track mount status and cleanup
  const isMountedRef = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set mounted to true when groupId changes
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, [groupId]);

  // Load existing messages when component mounts
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (isMountedRef.current) {
        setIsLoading(true);
        const { messages: initialMessages, hasMore: initialHasMore } =
          await loadMessages(groupId);
        if (isMountedRef.current) {
          setMessages(initialMessages);
          setHasMore(initialHasMore);
          setIsLoading(false);
        }
      }
    };

    loadInitialMessages();
  }, [groupId]);

  // Set up real-time subscription with reconnection
  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000;

    const connectToChannel = () => {
      const channel = supabase
        .channel(`group-messages:${groupId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "group_messages",
            filter: `group_id=eq.${groupId}`,
          },
          async (payload) => {
            try {
              // Check if component is still mounted before processing
              if (!isMountedRef.current) return;

              const rawMessage = payload.new as {
                id: string;
                content: string;
                sender_id: string;
                created_at: string;
              };

              // Fetch user information for the new message
              const { data: userData, error } = await supabase
                .from("users")
                .select("first_name, last_name")
                .eq("id", rawMessage.sender_id)
                .single();

              // Check again if component is still mounted after async operation
              if (!isMountedRef.current) return;

              if (error) {
                console.warn("Failed to fetch user data for message:", error);
              }

              const firstName = userData?.first_name || "";
              const lastName = userData?.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim() || "Unknown";

              const newMessage: GroupChatMessage = {
                id: rawMessage.id,
                content: rawMessage.content,
                user: { name: fullName },
                createdAt: rawMessage.created_at,
              };

              setMessages((current) => {
                // Prevent duplicates (in case the message was optimistically added)
                const exists = current.some((msg) => msg.id === newMessage.id);
                if (exists) return current;

                return [...current, newMessage];
              });
            } catch (error) {
              console.error("Error processing real-time message:", error);
            }
          }
        )
        .subscribe((status) => {
          console.log(`Channel status for group ${groupId}:`, status);

          // Check if component is still mounted
          if (!isMountedRef.current) return;

          setIsConnected(status === "SUBSCRIBED");

          if (status === "SUBSCRIBED") {
            console.log(`Successfully connected to group ${groupId}`);
            // Reset reconnection attempts on successful connection
            reconnectAttempts = 0;
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          } else if (
            (status === "CHANNEL_ERROR" || status === "TIMED_OUT") &&
            reconnectAttempts < maxReconnectAttempts &&
            isMountedRef.current
          ) {
            console.log(
              `Connection failed for group ${groupId}, attempt ${
                reconnectAttempts + 1
              }/${maxReconnectAttempts}`
            );
            // Clear any existing timeout
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }

            // Exponential backoff reconnection
            const delay = Math.min(
              baseReconnectDelay * Math.pow(2, reconnectAttempts),
              30000
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              // Check if still mounted before reconnecting
              if (isMountedRef.current) {
                reconnectAttempts++;
                // Remove the failed channel before reconnecting
                if (channelRef.current) {
                  supabase.removeChannel(channelRef.current);
                  channelRef.current = null;
                }
                connectToChannel();
              }
            }, delay);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.error(
              "Max reconnection attempts reached. Connection failed."
            );
          }
        });

      // Store reference to the channel
      channelRef.current = channel;
      return channel;
    };

    // Initial connection
    connectToChannel();

    // Cleanup function
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;

      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Remove the channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [groupId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !isMountedRef.current) return;

      try {
        // Insert to database - postgres_changes will handle the real-time update
        const messageData = await insertMessage(groupId, content.trim());

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;

        // Optimistically add message to UI (optional - for instant feedback)
        // This prevents waiting for the postgres_changes event
        setMessages((current) => {
          const exists = current.some((msg) => msg.id === messageData.id);
          if (exists) return current;
          return [...current, messageData];
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [groupId]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading || messages.length === 0) return;

    setIsLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      if (!oldestMessage) return;

      const { messages: olderMessages, hasMore: moreAvailable } =
        await loadMessages(groupId, 20, oldestMessage.createdAt);

      if (isMountedRef.current && olderMessages.length > 0) {
        setMessages((current) => {
          const existingIds = new Set(current.map((msg) => msg.id));
          const newMessages = olderMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );
          return [...newMessages, ...current];
        });
        setHasMore(moreAvailable);
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [groupId, hasMore, isLoadingMore, isLoading, messages]);

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMoreMessages,
  };
}
