import type { Message } from "@/pages/Protected/Groups";
import { cn, getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  currentUserName?: string;
}

// Helper function to format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  currentUserName,
}: MessageBubbleProps) {
  // Determine if this message is from the current user
  const isOwn = currentUserName
    ? message?.user?.name === currentUserName
    : false;

  // Get user initials
  const userInitials = getInitial(message?.user?.name);

  return (
    <div
      className={cn(
        "flex items-start space-x-3",
        isOwn && "flex-row-reverse space-x-reverse"
      )}
    >
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs font-medium bg-gray-200 text-gray-700">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col max-w-xs lg:max-w-md",
          isOwn && "items-end"
        )}
      >
        {!isOwn && (
          <span className="text-xs font-medium text-gray-700 mb-1">
            {message?.user?.name}
          </span>
        )}

        <div
          className={cn(
            "px-4 py-2 rounded-2xl",
            isOwn
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed">{message?.content}</p>
        </div>

        <span className="text-xs text-gray-500 mt-1">
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
