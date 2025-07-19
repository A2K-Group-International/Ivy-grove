import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { ChatInterface } from "@/components/groups/Chat-Interface";
import { GroupList } from "@/components/groups/Group-List";
import AddGroupMembers from "@/components/groups/AddGroupMembers";
import { Button } from "@/components/ui/button";
import { useGroups } from "@/hooks/groups/useGroups";
import ErrorMessage from "@/components/ErrorMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export interface Group {
  id: string;
  name: string;
  lastMessage?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

function Groups() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { groups, isLoading, error } = useGroups();
  const { userProfile } = useAuth(); // Get current user

  // Create current user's display name
  const currentUserName = userProfile
    ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() ||
      "You"
    : "You";

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setIsMobileView(true);
  };

  const handleBackToGroups = () => {
    setIsMobileView(false);
    setSelectedGroup(null);
  };

  // Transform fetched groups to match the UI interface
  const transformedGroups: Group[] =
    groups?.map((group) => ({
      id: group.id,
      name: group.name,
      avatar: "/Ivy-logo.png",
    })) || [];

  if (error) {
    return (
      <div className="flex h-dvh bg-gray-50 items-center justify-center">
        <ErrorMessage message={`Error loading groups: ${error.message}`} />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        {/* Sidebar */}
        <div className="border-r border-gray-200 flex flex-col">
          <GroupList
            groups={transformedGroups}
            selectedGroup={selectedGroup}
            onGroupSelect={setSelectedGroup}
            isLoading={isLoading}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedGroup ? (
            <ChatInterface
              group={selectedGroup}
              currentUserName={currentUserName}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a group to start chatting
                </h3>
                <p className="text-gray-500">
                  Choose a group from the sidebar to view and send messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        {!isMobileView ? (
          <GroupList
            groups={transformedGroups}
            selectedGroup={selectedGroup}
            onGroupSelect={handleGroupSelect}
            isLoading={isLoading}
          />
        ) : selectedGroup ? (
          <div className="flex flex-col h-[calc(100%-2.5rem)]">
            <div className="border-b border-gray-200 py-3 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToGroups}
                  className="mr-3 p-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage src="/Ivy-logo.png" />
                  <AvatarFallback>Ivy</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-gray-900">
                  {selectedGroup.name}
                </h2>
              </div>
              <AddGroupMembers group={selectedGroup} />
            </div>
            <ChatInterface
              group={selectedGroup}
              currentUserName={currentUserName}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Groups;
