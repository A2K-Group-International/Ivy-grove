import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "../ui/button";
import AnnouncementForm from "./AnnouncementForm";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useLocation, useSearchParams } from "react-router-dom";
import AutoLinkText from "@/lib/AutoLinkText";
import ImageLoader from "@/utils/ImageLoader";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { announcementPropType } from "@/types/announcements";

const Announcement = ({
  announcement,
  deleteAnnouncementMutation,
  isModal = false,
}: announcementPropType) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { userProfile } = useAuth();
  const location = useLocation();
  // eslint-disable-next-line
  const [_params, setParams] = useSearchParams();

  const handleParams = (announcementId: string) => {
    const params = new URLSearchParams();
    params.set("announcementId", announcementId);
    setParams(params);
  };
  console.log("Announcement data:", announcement);

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          <h2 className="text-lg font-bold  mb-2">{announcement?.title}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[0.7rem] font-bold md:text-sm ">
              {location.pathname.startsWith("/ministries") ||
              userProfile?.role === "admin" ||
              userProfile?.id === announcement?.created_by
                ? `${announcement?.users?.first_name} ${announcement?.users?.last_name}`
                : announcement?.users?.role.toUpperCase()}
            </p>
            {!isModal && (
              <p
                onClick={handleParams.bind(null, announcement.id)}
                className="text-[0.7rem]  hover:cursor-pointer hover:underline md:text-sm transition-colors"
              >
                {new Date(announcement?.created_at).toLocaleString()}
              </p>
            )}
            {isModal && (
              <p className="text-[0.7rem]  hover:cursor-pointer hover:underline md:text-sm transition-colors">
                {new Date(announcement?.created_at).toLocaleString()}
              </p>
            )}
            {announcement?.visibility === "public" ? (
              <Icon icon="mingcute:world-2-line" className="h-4 w-4 " />
            ) : (
              <Icon icon="mingcute:user-3-line" className="h-4 w-4 " />
            )}
          </div>
        </div>

        {userProfile?.id === announcement?.created_by && !isModal && (
          <Popover>
            <PopoverTrigger>
              <Icon
                icon="mingcute:more-1-line"
                className="h-6 w-6  transition-colors"
              />
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-32 overflow-hidden p-0  bg-white shadow-lg"
            >
              <div className="p-2 ">
                <p className="text-center font-semibold">Actions</p>
              </div>
              <Separator />

              <AnnouncementForm
                announcementId={announcement.id}
                files={announcement.announcement_files}
                title={announcement.title}
                content={announcement.content}
              >
                <Button
                  variant="ghost"
                  className="w-full rounded-none p-3 hover:cursor-pointer  "
                >
                  Edit
                </Button>
              </AnnouncementForm>

              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(isOpen) => {
                  setDeleteDialogOpen(isOpen);
                }}
              >
                <AlertDialogTrigger className="w-full" asChild>
                  <Button
                    variant="ghost"
                    className="w-full rounded-none text-start hover:cursor-pointer hover:bg-red-50 text-red-600"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl ">
                      Delete Announcement?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Announcement?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteAnnouncementMutation?.mutate({
                          announcementId: announcement.id,
                          filePaths: announcement.announcement_files.map(
                            (file) => file.url
                          ),
                        });
                        setDeleteDialogOpen(false);
                      }}
                      disabled={deleteAnnouncementMutation?.isPending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteAnnouncementMutation?.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <AutoLinkText
        text={announcement?.content}
        className="mb-6 block whitespace-pre-wrap break-words text-start leading-6 "
      />
      <Dialog>
        <div>
          <div className="flex w-full gap-2 mb-4">
            {announcement?.announcement_files?.length > 0 &&
              announcement?.announcement_files[0]?.type?.startsWith("image") &&
              announcement?.announcement_files.slice(0, 3).map((file, i) => (
                <DialogTrigger
                  onClick={() => setSelectedImageIndex(i)}
                  key={i}
                  className={cn(
                    "w-full border  hover:cursor-pointer  transition-colors",
                    {
                      relative: i === 2,
                    },
                    {
                      "overflow-hidden rounded-md":
                        i === 0 &&
                        announcement?.announcement_files.length === 1,
                    },
                    {
                      "overflow-hidden rounded-s-md":
                        i === 0 && announcement?.announcement_files.length > 1,
                    },
                    {
                      "relative z-20 overflow-hidden rounded-e-md":
                        i === 2 && announcement?.announcement_files.length > 2,
                    },
                    {
                      "relative z-20 overflow-hidden rounded-e-md":
                        i === 1 &&
                        announcement?.announcement_files.length > 1 &&
                        announcement?.announcement_files.length < 3,
                    }
                  )}
                >
                  <ImageLoader
                    className={cn(
                      "h-full w-full min-w-0 object-cover",
                      {
                        "opacity-45":
                          i === 2 &&
                          announcement?.announcement_files.length > 3,
                      },
                      {
                        "h-full": announcement?.announcement_files.length === 1,
                      }
                    )}
                    src={file.url}
                    alt="file"
                  />
                  {i === 2 && announcement?.announcement_files.length > 3 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <p className="text-base font-semibold text-white">
                        +{announcement?.announcement_files.length - 3} more
                      </p>
                    </div>
                  )}
                </DialogTrigger>
              ))}
          </div>
        </div>
        {announcement?.announcement_files?.length > 0 &&
          announcement.announcement_files[0]?.type?.startsWith("video") && (
            <div className="border rounded-lg overflow-hidden mb-4">
              <video
                className="h-fit w-full"
                controls
                src={announcement.announcement_files[0]?.url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

        {announcement?.announcement_files?.length > 0 &&
          announcement.announcement_files[0]?.type?.startsWith(
            "application"
          ) && (
            <a
              href={announcement.announcement_files[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2  underline mb-4 transition-colors"
            >
              <Icon icon="mingcute:attachment-2-fill" className="h-4 w-4" />
              {`${announcement.announcement_files[0]?.name}.${
                announcement.announcement_files[0].type.split("/")[1]
              }`}
            </a>
          )}
        <DialogContent className="flex h-full min-w-full items-center justify-center border-0 bg-transparent p-0">
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only"></DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
          </DialogHeader>
          <Carousel
            opts={{
              startIndex: selectedImageIndex,
            }}
            className="w-full max-w-5xl"
          >
            <CarouselContent className="-ml-1 p-0">
              {announcement?.announcement_files?.map((file, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="p-1">
                    <Card className="border-none bg-transparent">
                      <CardContent className="flex aspect-square items-center justify-center bg-transparent bg-contain p-0">
                        <ImageLoader
                          className="w-full object-contain"
                          src={file.url}
                          alt="an image of announcement "
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="" />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>

      <div className="flex items-end justify-between">
        <div className="relative h-5">
          {/* <TriggerLikeIcon
            className={"absolute w-14 rounded-3xl p-1"}
            comment_id={announcement?.id}
            user_id={userProfile?.id}
            columnName={"announcement_id"}
          /> */}
        </div>
      </div>
      {/* <Separator className="mb-3 mt-6 " /> */}

      {/* <Comments announcement_id={announcement?.id} isModal={isModal} /> */}
    </div>
  );
};

export default Announcement;
