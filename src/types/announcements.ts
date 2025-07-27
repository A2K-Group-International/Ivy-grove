import type { UseMutationResult } from "@tanstack/react-query";
import type { Database } from "./database";

type CreateAnnouncementType = {
  title: string;
  content: string;
  created_by?: string | null | undefined;
  groupId?: string | null;
  files?: File[] | File | undefined;
};

type EditAnnouncementType = CreateAnnouncementType & {
  announcementId: string | undefined;
};
type FetchAnnouncementsType = {
  page: number;
  pageSize: number;
  groupId?: string | null;
};
type DeleteAnnouncementType = {
  announcementId: string;
  filePaths?: string[];
};

type FileData = {
  url: string;
  name: string;
  type: string;
};

type BaseAnnouncement = Database["public"]["Tables"]["announcements"]["Row"];
type AnnouncementUser = {
  id?: string;
  first_name: string;
  last_name: string;
  role: Database["public"]["Enums"]["roles"];
};

type AnnouncementListItem = BaseAnnouncement & {
  users: AnnouncementUser;
  announcement_files: AnnouncementFile[];
};
type AnnouncementHeaderType = {
  image: string | null;
  first_name: string;
};

type AnnouncementFile = {
  url: string;
  name: string;
  type: string;
};

type AnnouncementFormType = {
  files?: AnnouncementFile[];
  title?: string;
  content?: string;
  announcementId?: string;
  children?: React.ReactNode;
  groupId?: string | null;
};

type announcementPropType = {
  announcement: AnnouncementListItem;
  deleteAnnouncementMutation?: UseMutationResult<
    void,
    Error,
    DeleteAnnouncementType,
    unknown
  >;
  isModal: boolean;
};
export type {
  announcementPropType,
  AnnouncementFormType,
  AnnouncementListItem,
  DeleteAnnouncementType,
  EditAnnouncementType,
  FetchAnnouncementsType,
  FileData,
  AnnouncementHeaderType,
  CreateAnnouncementType,
};
