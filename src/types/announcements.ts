import type { Database } from "./database";

type CreateAnnouncementType = {
  title: string;
  content: string;
  created_by: string;
  groupId?: string | null;
  files?: File[];
};

type EditAnnouncementType = CreateAnnouncementType & {
  announcementId: string;
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
type AnnouncementJoinType =
  Database["public"]["Tables"]["announcements"]["Row"] & {
    users: Database["public"]["Tables"]["users"]["Row"];
    announcement_files: Database["public"]["Tables"]["announcement_files"]["Row"][];
  };

export type {
  AnnouncementJoinType,
  DeleteAnnouncementType,
  EditAnnouncementType,
  FetchAnnouncementsType,
  FileData,
  CreateAnnouncementType,
};
