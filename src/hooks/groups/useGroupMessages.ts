import { insertMessage } from "@/services/groupMessages.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Insert message mutation
export const useSendMessage = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => insertMessage(groupId, content),
    onSuccess: () => {
      // Invalidate messages query
      queryClient.invalidateQueries({ queryKey: ["group-messages", groupId] });
    },
  });
};
