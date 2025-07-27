import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, fetchGroups, editGroup, deleteGroup } from "@/services/groups.service";
import { toast } from "sonner";

export const useGroups = () => {
  const queryClient = useQueryClient();

  // Fetch groups query
  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast("Group created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
    onError: (error) => {
      toast(`Error creating group: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  // Edit group mutation
  const editGroupMutation = useMutation({
    mutationFn: editGroup,
    onSuccess: () => {
      toast("Group updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
    onError: (error) => {
      toast(`Error updating group: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      toast("Group deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
    onError: (error) => {
      toast(`Error deleting group: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  return {
    // Fetch groups
    groups: groupsQuery.data,
    isLoading: groupsQuery.isLoading,
    error: groupsQuery.error,
    refetch: groupsQuery.refetch,
    
    // Create group
    createGroup: createGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    createError: createGroupMutation.error,

    // Edit group
    editGroup: editGroupMutation.mutate,
    isEditing: editGroupMutation.isPending,
    editError: editGroupMutation.error,

    // Delete group
    deleteGroup: deleteGroupMutation.mutate,
    isDeleting: deleteGroupMutation.isPending,
    deleteError: deleteGroupMutation.error,
  };
};

// Individual hooks for specific use cases
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast("Group created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
    onError: (error) => {
      toast(`Error creating group: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  return {
    createGroup: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
