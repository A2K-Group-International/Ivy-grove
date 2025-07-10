import { paginate } from "@/utils/paginate";
import { supabase } from "@/lib/supabase";
import type {
  AnnouncementListItem,
  CreateAnnouncementType,
  DeleteAnnouncementType,
  EditAnnouncementType,
  FetchAnnouncementsType,
  FileData,
} from "@/types/announcements";
import type { PaginateResult } from "@/types/utils";

/**
 * Creates a new announcement and uploads associated files to Supabase storage.
 * Also associates the announcement with ministries via the `announcement_ministries` table.
 *
 *
 * @throws {Error} If there is an error during the file upload, announcement creation, or ministry association.
 */

export const createAnnouncements = async ({
  title,
  content,
  created_by,
  groupId,
  files,
}: CreateAnnouncementType) => {
  const fileData: FileData[] = [];

  console.log("Creating announcement with files:", files);

  if (files) {
    const filesArray = Array.isArray(files) ? files : [files];
    await Promise.all(
      filesArray.map(async (file) => {
        const fileName = `${file.name.split(".")[0]}-${Date.now()}`;
        const fileExt = file.name.split(".")[1];

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(`announcement/${fileName}.${fileExt}`, file);

        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }

        fileData.push({
          url: uploadData.path,
          name: fileName,
          type: file.type,
        });
      })
    );
  }

  const { data: fetchData, error } = await supabase
    .from("announcements")
    .insert([
      {
        title: title,
        content: content,
        visibility: groupId ? "private" : "public",
        group_id: groupId ?? null,
        created_by: created_by as string,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting announcement:", error.message);
    throw error;
  }

  await Promise.all(
    fileData.map(async (file) => {
      const { error: insertError } = await supabase
        .from("announcement_files")
        .insert([{ announcement_id: fetchData.id, ...file }]);

      if (insertError) {
        console.error("Error inserting into announcement_files:", insertError);
        throw insertError;
      }
    })
  );

  return fetchData;
};

export const fetchSingleAnnouncement = async (
  announcementId: string | undefined | null
) => {
  try {
    if (!announcementId) {
      throw new Error(
        "Announcement ID is required to fetch a single announcement."
      );
    }

    const { data: announcement, error } = await supabase
      .from("announcements")
      .select(
        "*, users(first_name, last_name, role), announcement_files(id, url, name, type)"
      )
      .eq("id", announcementId)
      .single(); // Use single() as we expect one announcement

    if (error) {
      throw new Error(`Error fetching announcement: ${error.message}`);
    }

    if (!announcement) {
      return null; // Announcement not found
    }

    // Transform file URLs to public URLs
    const transformedAnnouncement = {
      ...announcement,
      announcement_files: announcement.announcement_files.map((file) => ({
        ...file,
        url: supabase.storage.from("uploads").getPublicUrl(file.url).data
          .publicUrl,
      })),
    };

    return transformedAnnouncement;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(
        err.message ||
          "An unexpected error occurred while fetching the announcement."
      );
    }
  }
};

/**
 * Fetches a paginated list of announcements, optionally filtering by ministry.
 * Combines public announcements and announcements associated with specific ministries.
 *
 * @param {number} page - The current page number for pagination.
 * @param {number} pageSize - The number of items per page for pagination.
 * @param {string | string[]} ministry_id - The ministry ID(s) to filter by. If an array, fetches announcements associated with any of the given ministries.
 *
 * @returns {Promise<Object>} A paginated list of announcements, with file URLs and pagination details.
 * @returns {Array} return.items - Array of announcement objects with file URLs.
 * @returns {number} return.pageSize - The number of items per page.
 * @returns {number} return.nextPage - The next page number for pagination.
 * @returns {number} return.totalItems - The total number of announcements across all pages.
 * @returns {number} return.totalPages - The total number of pages.
 * @returns {number} return.currentPage - The current page number.
 *
 * @throws {Error} If there is an error while fetching announcements.
 *
 *
 */

export const fetchAnnouncements = async ({
  page,
  pageSize,
  groupId,
}: FetchAnnouncementsType): Promise<PaginateResult<AnnouncementListItem>> => {
  try {
    const select =
      "*, users(first_name,last_name,role), announcement_files(url,name,type)";
    const order = [{ column: "created_at" as const, ascending: false }];

    const query: Record<string, string> = {};

    if (groupId) {
      query.group_id = groupId;
    } else {
      query.visibility = "public";
    }

    const paginatedData = await paginate<"announcements", AnnouncementListItem>(
      {
        key: "announcements",
        page,
        pageSize,
        query,
        order,
        select,
        filters: {},
      }
    );

    const typedItems = paginatedData.items as AnnouncementListItem[];

    const transformedItems = await Promise.all(
      typedItems.map(async (item) => ({
        ...item,
        announcement_files: await Promise.all(
          item.announcement_files.map(async (file) => {
            const { data, error } = await supabase.storage
              .from("uploads")
              .createSignedUrl(file.url, 60 * 60);

            if (error || !data?.signedUrl) {
              console.error("Error generating signed URL:", error);
              return { ...file, url: file.url };
            }

            return {
              ...file,
              url: data.signedUrl,
            };
          })
        ),
      }))
    );

    return {
      ...paginatedData,
      items: transformedItems,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching announcements:", error.message);
      throw new Error(
        error.message ||
          "An unexpected error occurred while fetching announcements."
      );
    }
    throw error;
  }
};

/**
 * Edits an existing announcement. Optionally uploads a new file, deletes the old file, and updates ministry associations.
 * If the visibility is set to "public," it deletes previous ministry associations.
 *
 *
 * @param {Object} announcementData - the data for editting announcement
 * @param {string} announcementData.announcement_id - The ID of the announcement to edit.
 * @param {string} announcementData.title - The updated title of the announcement.
 * @param {string} announcementData.content - The updated content of the announcement.
 * @param {string} announcementData.visibility - The updated visibility of the announcement (e.g., 'public').
 * @param {File} [announcementData.file] - The new file to be uploaded (optional).
 * @param {string} [announcementData.filePath] - The file path of the existing file to be deleted (optional).
 * @param {string[]} announcementData.ministry - The updated list of ministry IDs to associate with the announcement.
 *
 * @throws {Error} If there is an error during the file upload, announcement update, or ministry association update.
 */
export const editAnnouncement = async ({
  title,
  content,
  files,
  announcementId,
}: EditAnnouncementType) => {
  if (!announcementId) {
    throw new Error("Announcement ID is required for editing.");
  }
  const { data: existingFiles, error } = await supabase
    .from("announcement_files")
    .select("id,name,url")
    .eq("announcement_id", announcementId);

  if (error) {
    throw new Error("Error checking existing files.");
  }

  // Delete files that are not in the new data.files array
  const filesToDelete = existingFiles.filter((existingFile) => {
    if (!files) return true;
    const filesArray = Array.isArray(files) ? files : [files];
    return !filesArray.some((file) => file.name === existingFile.name);
  });

  if (filesToDelete.length > 0) {
    const fileIdsToDelete = filesToDelete.map((file) => file.id);
    const filePathToDelete = filesToDelete.map((file) => file.url);

    const { error: storageError } = await supabase.storage
      .from("uploads")
      .remove(filePathToDelete);

    if (storageError) {
      throw new Error(`Error deleting file: ${storageError.message}`);
    }

    const { error: deleteError } = await supabase
      .from("announcement_files")
      .delete()
      .in("id", fileIdsToDelete);

    if (deleteError) {
      throw new Error(`Error deleting files: ${deleteError.message}`);
    }
  }

  let fileData: FileData[] = [];
  // Upload new or updated files using their original name
  if (files) {
    const filesArray = Array.isArray(files) ? files : [files];
    fileData = await Promise.all(
      filesArray.map(async (file) => {
        const fileName = file.name;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(`announcement/${fileName}`, file, { upsert: true });

        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }

        return {
          url: uploadData.path,
          name: fileName,
          type: file.type,
        };
      })
    );
  }

  // Update announcement details
  const { error: updateError } = await supabase
    .from("announcements")
    .update({
      title: title,
      content: content,
    })
    .eq("id", announcementId);

  if (updateError) {
    throw new Error("Error updating announcement.");
  }

  // Upsert file data with conflict resolution on announcement_id and name
  await Promise.all(
    fileData.map(async (file) => {
      // Check if the file already exists
      const { data: existingFile, error: selectError } = await supabase
        .from("announcement_files")
        .select("id")
        .eq("announcement_id", announcementId)
        .eq("name", file.name)
        .single(); // Get a single record

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Error checking existing file:", selectError);
        throw selectError;
      }

      // If file does NOT exist, insert it
      if (!existingFile) {
        const { error: insertError } = await supabase
          .from("announcement_files")
          .insert([{ announcement_id: announcementId, ...file }]);

        if (insertError) {
          // Check if the error is a unique constraint violation
          if (insertError.code === "23505") {
            throw new Error("Cannot upload the same image.");
          }
          console.error(
            "Error inserting into announcement_files:",
            insertError
          );
          throw insertError;
        }
      }
    })
  );
};

/**
 * Deletes an announcement and its associated file (if a file path is provided).
 * Checks if the announcement exists before deleting it.
 *
 *  @param {Object} params - The parameters for deleting an announcement.
 * @param {String} params.annnouncement_id - Id of the announcement to be deleted
 * @param {String} params.filepath - file path of the announcement file to be deleted
 */
export const deleteAnnouncement = async ({
  announcementId,
  filePaths,
}: DeleteAnnouncementType) => {
  const urls = filePaths?.map((publicUrl) => {
    try {
      const decodedUrl = decodeURIComponent(publicUrl);
      const urlParts = new URL(decodedUrl);
      const path = urlParts.pathname.split(
        "/storage/v1/object/public/uploads/"
      )[1];

      if (!path) {
        throw new Error("Invalid file path extracted.");
      }

      return decodeURIComponent(path);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Error decoding URL: ${errorMessage}. Please check the URL format.`
      );
    }
  });

  if (!announcementId) {
    throw new Error("Announcement ID is missing");
  }

  // Check if announcement exists before deletion
  const { data, error: existenceError } = await supabase
    .from("announcements")
    .select("id")
    .eq("id", announcementId)
    .single();

  if (existenceError) {
    throw new Error(
      `Error finding existing announcement: ${existenceError.message}`
    );
  }

  // Proceed with file deletion only if urls are valid
  if (urls && urls.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("uploads")
      .remove(urls); // Remove files correctly

    if (storageError) {
      throw new Error(`Error deleting file: ${storageError.message}`);
    }
  }

  // Delete the announcement from the database
  const { error: deleteError } = await supabase
    .from("announcements")
    .delete()
    .eq("id", data.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
};

// /**
//  * Fetches the ministry IDs associated with a specific announcement.
//  * @param {String} announcement_id - announcement ID to fetch all ministry ID it belongs to
//  * @returns {Promise<string[]>} - A list of ministry IDs associated with the announcement.
//  * @throws {Error} If there is an error while fetching the associated ministries.
//  */

// export const getAnnouncementMinistryId = async (announcement_id) => {
//   const { data, error } = await supabase
//     .from("announcement_ministries")
//     .select("ministry_id")
//     .eq("announcement_id", announcement_id);

//   const ministryIds = data?.map((ministry) => ministry.ministry_id) || [];
//   if (error) {
//     throw new Error(error.message);
//   }
//   return ministryIds;
// };

// export const getAnnouncementByComment = async (commentId) => {
//   const { data, error } = await supabase
//     .from("comment_data")
//     .select(
//       "announcement(id, title, content, created_at, visibility, users(first_name, last_name, role), announcement_files(id, url, name, type))"
//     )
//     .eq("id", commentId)
//     .single();

//   if (error) {
//     throw new Error(error.message);
//   }

//   // Transform file URLs to public URLs
//   data.announcement.announcement_files =
//     data.announcement.announcement_files.map((file) => ({
//       ...file,
//       url: supabase.storage.from("uploads").getPublicUrl(file.url).data
//         .publicUrl,
//     }));

//   return data;
// };
