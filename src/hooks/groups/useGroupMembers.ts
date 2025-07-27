import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupMembers, addGroupMembers, removeGroupMember, fetchAvailableUsers } from "@/services/groupMembers.service";
import { toast } from "sonner";

export const useGroupMembers = (groupId: string) => {
  const queryClient = useQueryClient();

  // Fetch group members query
  const membersQuery = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => fetchGroupMembers(groupId),
    enabled: !!groupId,
  });

  // Fetch available users query (backend filtered)
  const availableUsersQuery = useQuery({
    queryKey: ["available-users", groupId],
    queryFn: () => fetchAvailableUsers(groupId),
    enabled: !!groupId,
  });

  // Add members mutation
  const addMembersMutation = useMutation({
    mutationFn: (userIds: string[]) => addGroupMembers(groupId, userIds),
    onSuccess: () => {
      toast("Members added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["group-members", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-users", groupId],
      });
    },
    onError: (error) => {
      toast(`Error adding members: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeGroupMember(groupId, userId),
    onSuccess: () => {
      toast("Member removed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["group-members", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-users", groupId],
      });
    },
    onError: (error) => {
      toast(`Error removing member: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  return {
    // Fetch members
    members: membersQuery.data,
    isLoading: membersQuery.isLoading,
    error: membersQuery.error,
    refetch: membersQuery.refetch,
    
    // Fetch available users
    availableUsers: availableUsersQuery.data,
    isLoadingUsers: availableUsersQuery.isLoading,
    usersError: availableUsersQuery.error,
    
    // Add members
    addMembers: addMembersMutation.mutate,
    isAdding: addMembersMutation.isPending,
    addError: addMembersMutation.error,

    // Remove member
    removeMember: removeMemberMutation.mutate,
    isRemoving: removeMemberMutation.isPending,
    removeError: removeMemberMutation.error,
  };
};