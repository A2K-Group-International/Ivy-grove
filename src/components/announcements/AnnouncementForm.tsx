import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import useAnnouncements from "@/hooks/useAnnouncements";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { fileTypes } from "@/constants/fileTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnnouncementSchema,
  type AnnouncementSchemaType,
} from "@/validations/AnnouncementSchema";
import { Label } from "../ui/label";
import ImageLoader from "@/utils/ImageLoader";
import type { AnnouncementFormType } from "@/types/announcements";
import { useAuth } from "@/context/AuthContext";

const AnnouncementForm = ({
  files,
  title,
  content,
  announcementId,
  children,
}: AnnouncementFormType) => {
  const { userProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFileType, setSelectedFileTypes] = useState(
    files ? "Mixed" : "None"
  );
  const [filePreviews, setFilePreviews] = useState<
    { id: string; url: string; type: string; name: string }[]
  >([]);
  const [dragOver, setDragOver] = useState(false);

  const form = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: title ?? "",
      content: content ?? "",
      files: [],
    },
  });

  const { addAnnouncementMutation, editAnnouncementMutation } =
    useAnnouncements(null);

  const onSubmit = (data: AnnouncementSchemaType) => {
    if (title) {
      editAnnouncementMutation.mutate(
        {
          title: data.title,
          content: data.content,
          files: data.files,
          announcementId: announcementId,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            form.reset();
            setCurrentFiles([]);
            setSelectedFileTypes("None");
            setFilePreviews([]);
          },
        }
      );
    } else {
      addAnnouncementMutation.mutate(
        {
          title: data.title,
          content: data.content,
          files: data.files,
          created_by: userProfile?.id,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            form.reset();
            setCurrentFiles([]);
            setSelectedFileTypes("None");
            setFilePreviews([]);
          },
        }
      );
    }

    // Clean up object URLs
    filePreviews.forEach((preview) => {
      if (preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    });
  };

  useEffect(() => {
    if (files && files.length > 0) {
      const fetchFiles = async () => {
        const fileObjects = await Promise.all(
          files.map(async (file) => {
            const response = await fetch(file.url);
            const blob = await response.blob();
            return new File([blob], file.name, { type: file.type });
          })
        );

        form.setValue("files", fileObjects);
        setCurrentFiles(fileObjects);
        setFilePreviews(
          files.map((file, index) => ({
            id: `existing-${index}`,
            url: file.url,
            type: file.type,
            name: file.name,
          }))
        );
      };

      fetchFiles();
    }
  }, [files, form]);

  const handleRemoveFile = (index: number) => {
    const preview = filePreviews[index];

    // Only revoke object URLs for newly created previews (not existing file URLs)
    if (preview && preview.url.startsWith("blob:")) {
      URL.revokeObjectURL(preview.url);
    }

    const filesValue = form.getValues("files") || [];
    const updatedFiles = (
      Array.isArray(filesValue) ? filesValue : [filesValue]
    ).filter((_, i) => i !== index);

    form.setValue("files", updatedFiles);
    setCurrentFiles(updatedFiles);
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 50 * 1024 * 1024; // 50MB limit

    if (file.size > maxSize) {
      return { isValid: false, error: "File size must be less than 50MB" };
    }

    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      // Videos
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/csv",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error:
          "File type not supported. Please select images, videos, or documents.",
      };
    }

    return { isValid: true };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    processFiles(droppedFiles);
  };

  const processFiles = (fileList: File[]) => {
    const validFiles = [];
    const errors = [];

    // Validate all files
    for (const file of fileList) {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    // Add all valid files immediately for instant previews
    if (validFiles.length > 0) {
      const newFiles = [...currentFiles, ...validFiles];
      form.setValue("files", newFiles);
      setCurrentFiles(newFiles);

      const newPreviews = validFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
      }));
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }

    if (errors.length > 0) {
      alert("Some files were rejected:\\n" + errors.join("\\n"));
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          // Clean up object URLs
          filePreviews.forEach((preview) => {
            if (preview.url.startsWith("blob:")) {
              URL.revokeObjectURL(preview.url);
            }
          });

          form.reset();
          setCurrentFiles([]);
          setFilePreviews([]);
          setSelectedFileTypes(files ? "Mixed" : "None");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="no-scrollbar h-fit overflow-scroll  bg-white shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold ">
            {title ? "Edit Announcement" : "Create Announcement"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {title ? "Edit your announcement." : "Create Announcement Publicly"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form id="announcement-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="rounded-lg border  p-6 py-[18px] mb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-none border-0 bg-transparent p-0 font-bold placeholder:text-[16px] focus-visible:ring-0 focus:ring-0 focus:border-none"
                        placeholder="Announcement Title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator className=" my-3" />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="no-scrollbar resize-none rounded-none border-0 bg-transparent p-0 placeholder:text-sm focus-visible:ring-0 focus:ring-0 focus:border-none"
                        placeholder="Announcement body..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-4">
              {form.formState.errors.title && (
                <p className="text-sm font-medium text-red-600 mb-2">
                  {form.formState.errors.title.message}
                </p>
              )}
              {form.formState.errors.content && (
                <p className="text-sm font-medium text-red-600">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      id="file-input"
                      type="file"
                      accept={
                        selectedFileType === "Mixed"
                          ? "image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
                          : selectedFileType === "Image(s)"
                          ? "image/*"
                          : selectedFileType === "Video"
                          ? "video/*"
                          : "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
                      }
                      className="hidden"
                      multiple={true}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;

                        const fileArray = Array.from(files);

                        if (selectedFileType === "Mixed") {
                          // Accept all supported file types
                          processFiles(fileArray);
                        } else {
                          // Filter files based on selected type
                          const filteredFiles = fileArray.filter((file) => {
                            if (selectedFileType === "Image(s)") {
                              return file.type.startsWith("image/");
                            } else if (selectedFileType === "Video") {
                              return file.type.startsWith("video/");
                            } else if (selectedFileType === "PDF Document") {
                              return (
                                file.type.startsWith("application/") ||
                                file.type.startsWith("text/")
                              );
                            }
                            return false;
                          });

                          if (filteredFiles.length !== fileArray.length) {
                            const rejectedCount =
                              fileArray.length - filteredFiles.length;
                            alert(
                              `${rejectedCount} file(s) were rejected because they don't match the selected file type.`
                            );
                          }

                          if (filteredFiles.length > 0) {
                            processFiles(filteredFiles);
                          }
                        }

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="max-w-full space-y-3 rounded-lg border  px-6 pb-[12px] pt-[16px] mb-4">
              <p className="text-[12px] ">
                <span className="font-bold">Attachment:</span>{" "}
                {selectedFileType}
              </p>
              <div className="flex gap-2">
                {fileTypes.map(({ icon, value }, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      // Clean up existing object URLs
                      filePreviews.forEach((preview) => {
                        if (preview.url.startsWith("blob:")) {
                          URL.revokeObjectURL(preview.url);
                        }
                      });

                      setFilePreviews([]);
                      setSelectedFileTypes(value);
                      setCurrentFiles([]);
                      form.setValue("files", []);
                    }}
                    className={cn(
                      "rounded-lg border  bg-white px-[14px] py-[8px] hover:cursor-pointer ",
                      {
                        "bg-school-600 ": selectedFileType === value,
                      }
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5 ", {
                        "text-white": selectedFileType === value,
                      })}
                      icon={`mingcute:${icon}`}
                    />
                  </div>
                ))}
              </div>
              <Separator />

              {(selectedFileType === "Mixed" ||
                selectedFileType === "Image(s)" ||
                selectedFileType === "Video" ||
                selectedFileType === "PDF Document") && (
                <div className="relative">
                  <div
                    className={cn(
                      "flex gap-3 p-2 rounded-lg transition-colors",
                      "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
                      dragOver ? "bg-blue-50 border-blue-300" : "bg-gray-50"
                    )}
                    style={{
                      maxHeight: "100px",
                      minHeight: "100px",
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {filePreviews.map((preview, index) => {
                      const isImage = preview.type.startsWith("image/");
                      const isVideo = preview.type.startsWith("video/");
                      const isPdf = preview.type === "application/pdf";

                      return (
                        <div
                          key={preview.id}
                          className="group relative flex h-[80px] w-[80px] flex-shrink-0 rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-all"
                        >
                          {isImage && (
                            <ImageLoader
                              className="object-cover w-full h-full"
                              src={preview.url}
                              alt={preview.name}
                            />
                          )}
                          {isVideo && (
                            <video
                              className="object-cover w-full h-full"
                              src={preview.url}
                              muted
                            />
                          )}
                          {!isImage && !isVideo && (
                            <div className="bg-white flex flex-col items-center justify-center w-full h-full p-1">
                              <Icon
                                className={cn(
                                  "h-6 w-6 mb-1",
                                  isPdf ? "text-red-500" : "text-gray-500"
                                )}
                                icon={
                                  isPdf
                                    ? "mingcute:file-pdf-fill"
                                    : "mingcute:file-fill"
                                }
                              />
                              <p
                                className="text-xs text-center truncate w-full"
                                title={preview.name}
                              >
                                {preview.name.length > 8
                                  ? preview.name.substring(0, 8) + "..."
                                  : preview.name}
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Remove ${
                              isImage ? "image" : isVideo ? "video" : "file"
                            }`}
                          >
                            <Icon
                              className="h-2.5 w-2.5"
                              icon="mingcute:close-line"
                            />
                          </button>
                        </div>
                      );
                    })}
                    <Label htmlFor="file-input">
                      <div
                        className={cn(
                          "flex h-[80px] w-[80px] flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer",
                          dragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <div className="text-center">
                          <Icon
                            className="h-6 w-6 mx-auto mb-1 text-gray-400"
                            icon="mingcute:add-line"
                          />
                          <p className="text-xs text-gray-500">
                            {selectedFileType === "Mixed"
                              ? "Add Files"
                              : selectedFileType === "Image(s)"
                              ? "Images"
                              : selectedFileType === "Video"
                              ? "Video"
                              : "Docs"}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              )}
            </div>
            {form.formState.errors.files && (
              <p className="text-sm font-medium text-red-600 mb-4">
                {form.formState.errors.files.message}
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel className="  flex-1">Cancel</AlertDialogCancel>
              <Button
                className="flex-1 bg-school-600 hover:bg-school-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={
                  addAnnouncementMutation.isPending ||
                  editAnnouncementMutation.isPending
                }
              >
                {addAnnouncementMutation.isPending ||
                editAnnouncementMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {title ? "Updating..." : "Posting..."}
                  </div>
                ) : title ? (
                  "Update"
                ) : (
                  "Post"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AnnouncementForm;
