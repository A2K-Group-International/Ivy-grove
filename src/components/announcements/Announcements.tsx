import Announcement from "@/components/Announcements/Announcement";
// import useAnnouncements from "@/hooks/useAnnouncements";
import useInterObserver from "@/hooks/useInterObserver";
// import Loading from "@/components/Loading";
import AnnouncementHeader from "@/components/Announcements/AnnouncementHeader";
import AnnouncementModal from "@/components/Announcements/AnnouncementModal";
import { useAuth } from "@/context/AuthContext";
import useAnnouncements from "@/hooks/useAnnouncements";

const Announcements = () => {
  const { user } = useAuth();

  const {
    fetchNextPage,
    deleteAnnouncementMutation,
    hasNextPage,
    editAnnouncementMutation,
    data,
    isLoading,
  } = useAnnouncements(null);

  const { ref } = useInterObserver(fetchNextPage);

  if (!user) return <Loading />;

  return (
    <div className="flex h-full w-full flex-col">
      <AnnouncementModal />

      <div className="mb-2 flex w-3/4 items-end justify-between lg:mb-6">
        <div className="">
          <h2 className="mb-0 lg:mb-3">Announcements</h2>
        </div>
        {/* 
        {(userData?.role == "coordinator" || userData.role == "volunteer") && (
   
        )} */}
      </div>

      <div className="no-scrollbar flex h-fit w-full flex-col-reverse gap-4 overflow-y-scroll lg:h-full lg:flex-row">
        {/* Announcements List */}
        <div className="no-scrollbar flex w-full flex-col items-center overflow-y-scroll rounded-none border-primary-outline p-1 pt-3 md:rounded-xl md:border md:bg-primary md:px-9 md:py-6">
          <div className="w-full lg:w-2/3">
            {(user?.role === "admin" || user?.role === "coordinator") && (
              <AnnouncementHeader image={user} first_name={user?.first_name} />
            )}
            {isLoading && <Loading />}

            {data?.pages?.flatMap((page) => page.items).length === 0 ? (
              <p>No announcements yet.</p>
            ) : (
              data?.pages?.flatMap((page) =>
                page?.items?.map((announcement) => (
                  <div
                    id={announcement.id}
                    key={announcement.id}
                    className="mb-3 w-full rounded-lg border border-primary-outline bg-[#f9f7f7b9] px-4 pb-6 pt-3 md:bg-white md:px-8 md:pt-5"
                  >
                    <Announcement
                      announcement={announcement}
                      editAnnouncementMutation={editAnnouncementMutation}
                      deleteAnnouncementMutation={deleteAnnouncementMutation}
                    />
                  </div>
                ))
              )
            )}

            {hasNextPage && <div className="mt-20" ref={ref}></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
