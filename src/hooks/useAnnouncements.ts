import {
  createAnnouncements,
  deleteAnnouncement,
  editAnnouncement,
  fetchAnnouncements,
} from "@/services/announcementService";
import type { DeleteAnnouncementType } from "@/types/announcements";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
const useAnnouncements = (groupId: string | null) => {
  const queryClient = useQueryClient();

  const queryKey = ["announcements", groupId];

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const response = await fetchAnnouncements({
        page: pageParam,
        pageSize: 5,
        groupId,
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.nextPage && lastPage?.currentPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: createAnnouncements,
    onSuccess: () => {
      toast("Announcement Created");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      toast("Something went wrong", {
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const editAnnouncementMutation = useMutation({
    mutationFn: editAnnouncement,
    onSuccess: () => {
      toast("Announcement Edited");
    },
    onError: (error) => {
      toast("Something went wrong", {
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: DeleteAnnouncementType) =>
      await deleteAnnouncement(announcementData),
    onSuccess: () => {
      toast("Announcement deleted");
    },
    onError: (error) => {
      toast("Something went wrong", {
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    addAnnouncementMutation,
    deleteAnnouncementMutation,
    editAnnouncementMutation,
  };
};

export default useAnnouncements;
