import type { Group } from "@/pages/Protected/Groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageBubble } from "./Message-Bubble";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import AddGroupMembers from "./AddGroupMembers";
import { useGroupChat } from "@/hooks/groups/useGroupChat";
import { useChatScroll } from "@/hooks/groups/useChatScroll";

interface ChatInterfaceProps {
  group: Group;
  currentUserName: string;
}

export function ChatInterface({ group, currentUserName }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    loadMoreMessages,
    isLoadingMore,
    hasMore,
  } = useGroupChat({
    groupId: group.id,
  });

  const { containerRef, scrollToBottom } = useChatScroll({
    onLoadMore: loadMoreMessages,
    isLoadingMore,
    hasMore,
  });

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Only scroll to bottom for new messages or initial load, not when loading older ones
    if (!isLoadingMore && shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, isLoadingMore, shouldScrollToBottom]);

  // Disable auto-scroll when user scrolls up to load more
  useEffect(() => {
    if (isLoadingMore) {
      setShouldScrollToBottom(false);
    }
  }, [isLoadingMore]);

  // Re-enable auto-scroll when sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setIsSending(true);
      setShouldScrollToBottom(true); // Enable scroll for new message
      try {
        await sendMessage(newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex flex-col h-full ">
      {/* Chat Header - Hidden on mobile as it's handled in parent */}
      <div className="hidden md:block border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Avatar>
              <AvatarImage src={group.avatar} />
              <AvatarFallback>Ivy</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{group.name}</h2>
              {/* Connection status indicator */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>

          <div>
            <AddGroupMembers group={group} />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 px-1 overflow-y-auto place-content-end"
        ref={containerRef}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoadingMore && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading more messages...
                </span>
              </div>
            )}
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserName={currentUserName}
                className={index === messages.length - 1 ? "pb-16" : ""}
              />
            ))}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 absolute bottom-0 w-full py-3 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 px-2 relative">
            <Input
              placeholder={`Message ${group.name}`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10 resize-none"
              disabled={isSending}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="sm"
            className="px-3"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
