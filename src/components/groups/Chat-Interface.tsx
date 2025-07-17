"use client";

import type React from "react";

import type { Group } from "@/pages/Protected/Groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Smile, Loader2 } from "lucide-react";
import { useState } from "react";
import { MessageBubble } from "./Message-Bubble";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AddGroupMembers from "./AddGroupMembers";
import { useGroupChat } from "@/hooks/groups/useGroupChat";

interface ChatInterfaceProps {
  group: Group;
  currentUserName: string;
}

export function ChatInterface({ group, currentUserName }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");

  // Use the useGroupChat hook instead of useSendMessage
  const { messages, sendMessage, isConnected, isLoading } = useGroupChat({
    groupId: group.id,
    currentUserName,
  });

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim() && isConnected) {
      setIsSending(true);
      try {
        await sendMessage(newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
        // You might want to show a toast notification here
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
    <div className="flex flex-col h-full">
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
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserName={currentUserName}
              />
            ))}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-gray-200 py-2">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder={`Message ${group.name}`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10 resize-none"
              disabled={!isConnected || isSending}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected || isSending}
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
