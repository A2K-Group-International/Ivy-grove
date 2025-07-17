import type { Group } from "@/pages/Protected/Groups";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CreateGroupForm from "./CreateGroupForm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import GroupActionBtn from "./GroupActionBtn";
import GroupCardSkeletion from "./GroupCardSkeleton";

interface GroupListProps {
  groups: Group[];
  selectedGroup: Group | null;
  onGroupSelect: (group: Group) => void;
  isLoading?: boolean;
}

export function GroupList({
  groups,
  selectedGroup,
  onGroupSelect,
  isLoading = false,
}: GroupListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === "admin";

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-dvh">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Groups</h1>
          {isAdmin && <CreateGroupForm />}
        </div>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Groups List */}
      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-y-2">
          {isLoading ? (
            // Loading skeleton
            <GroupCardSkeletion />
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => onGroupSelect(group)}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                  selectedGroup?.id === group.id
                    ? "bg-school-100 border border-school-200"
                    : ""
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={group.avatar} />
                    <AvatarFallback>Ivy</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="ml-3 flex-1 flex justify-between min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {group.name.length > 20
                      ? `${group.name.slice(0, 20)}...`
                      : group.name}
                  </h3>
                  {isAdmin && <GroupActionBtn group={group} />}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No groups found</p>
              {isAdmin && (
                <p className="text-sm mt-1">
                  Create your first group to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
