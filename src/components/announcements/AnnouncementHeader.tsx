import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";

import type { AnnouncementHeaderType } from "@/types/announcements";
import AnnouncementForm from "./AnnouncementForm";

const AnnouncementHeader = ({ image, first_name }: AnnouncementHeaderType) => {
  return (
    <>
      <div className="flex h-[84px] w-full gap-3 rounded-lg border px-8 py-6 ">
        <Avatar className="h-8 w-8 border-2 ">
          <AvatarImage src={image ?? ""} alt="profile picture" />
          <AvatarFallback className="bg-school-600 text-white">
            {getInitial(first_name)}
          </AvatarFallback>
        </Avatar>

        <AnnouncementForm>
          <div className="flex w-full gap-2">
            <Input
              placeholder="Announce something publicly..."
              className="border bg-white "
            />
            <Button className="h-9 w-14 rounded-full bg-school-600 hover:bg-school-700 text-white">
              <Icon className="text-white" icon="mingcute:photo-album-fill" />
            </Button>
          </div>
        </AnnouncementForm>
      </div>
      <div className="flex w-full items-center justify-center overflow-hidden py-6">
        <Separator />
        <p className="px-4  font-medium"> Announcements</p>
        <Separator />
      </div>
    </>
  );
};

export default AnnouncementHeader;
