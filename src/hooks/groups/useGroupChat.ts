// Enhanced useGroupChat hook with Database Realtime
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { insertMessage } from "@/services/groupMessages.services";

interface UseGroupChatProps {
  groupId: string;
  currentUserName: string;
}

export interface GroupChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export function useGroupChat({ groupId }: UseGroupChatProps) {
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("group_messages")
          .select(
            `
            id,
            content,
            created_at,
            profiles:sender_id (first_name, last_name)
          `
          )
          .eq("group_id", groupId)
          .order("created_at", { ascending: true });

        if (data && !error) {
          const formattedMessages: GroupChatMessage[] = data.map((msg) => {
            const firstName = msg.profiles?.first_name || "";
            const lastName = msg.profiles?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Unknown";

            return {
              id: msg.id,
              content: msg.content,
              user: { name: fullName },
              createdAt: msg.created_at,
            };
          });
          setMessages(formattedMessages);
        } else if (error) {
          console.error("Failed to load messages:", error);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [groupId]);

  // Set up database realtime subscription instead of broadcast
  useEffect(() => {
    const newChannel = supabase
      .channel(`group-messages-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the complete message with user info
          const { data } = await supabase
            .from("group_messages")
            .select(
              `
              id,
              content,
              created_at,
              profiles:sender_id (first_name, last_name)
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (data) {
            const firstName = data.profiles?.first_name || "";
            const lastName = data.profiles?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Unknown";

            const newMessage: GroupChatMessage = {
              id: data.id,
              content: data.content,
              user: { name: fullName },
              createdAt: data.created_at,
            };

            setMessages((current) => {
              // Prevent duplicates
              if (current.some((msg) => msg.id === newMessage.id))
                return current;
              return [...current, newMessage];
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime connection status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      setIsConnected(false);
      supabase.removeChannel(newChannel);
    };
  }, [groupId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      try {
        // Just insert to database - realtime will handle the rest
        await insertMessage(groupId, content.trim());
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [groupId]
  );

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
  };
}
