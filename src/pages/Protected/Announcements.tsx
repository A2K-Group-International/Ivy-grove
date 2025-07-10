import Announcement from "@/components/announcements/Announcement";
// import useAnnouncements from "@/hooks/useAnnouncements";
import useInterObserver from "@/hooks/useInterObserver";
import Loading from "@/components/Loading";
import AnnouncementHeader from "@/components/announcements/AnnouncementHeader";
import AnnouncementModal from "@/components/announcements/AnnouncementModal";
import useAnnouncements from "@/hooks/useAnnouncements";
import { useAuth } from "@/context/AuthContext";

const Announcements = () => {
  const { userProfile, userRole } = useAuth();

  const {
    fetchNextPage,
    deleteAnnouncementMutation,
    hasNextPage,
    // editAnnouncementMutation,
    data,
    isLoading,
  } = useAnnouncements(null);

  const { ref } = useInterObserver(fetchNextPage);

  if (!userProfile) return <Loading />;

  return (
    <div className="flex h-full w-full flex-col ">
      <AnnouncementModal />

      <div className="flex w-3/4 items-end justify-between">
        <div className="">
          <h1 className="text-2xl font-bold text-school-800">Announcements</h1>
          <p>View and manage school announcements and updates.</p>
        </div>
        {/* 
        {(userData?.role == "coordinator" || userData.role == "volunteer") && (
   
        )} */}
      </div>

      <div className="flex h-fit w-full flex-col-reverse gap-4 lg:h-full lg:flex-row">
        {/* Announcements List */}
        <div className="no-scrollbar flex w-full flex-col items-center overflow-y-scroll rounded-lg bg-white p-1 pt-3 md:px-9 md:py-6">
          <div className="w-full lg:w-2/3">
            {userRole === "admin" && (
              <AnnouncementHeader
                image={""}
                first_name={userProfile?.first_name}
              />
            )}
            {isLoading && <Loading />}

            {data?.pages?.flatMap((page) => page.items).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-school-500 text-lg">No announcements yet.</p>
              </div>
            ) : (
              data?.pages?.flatMap((page) =>
                page?.items?.map((announcement) => (
                  <div
                    id={announcement.id}
                    key={announcement.id}
                    className="mb-6 w-full rounded-lg border  bg-white px-4 pb-6 pt-3 md:px-8 md:pt-5"
                  >
                    <Announcement
                      isModal={false}
                      announcement={announcement}
                      // editAnnouncementMutation={editAnnouncementMutation}
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
