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
    files ? "Image(s)" : "None"
  );
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedPDF, setSelectedPDF] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
      editAnnouncementMutation.mutate({
        title: data.title,
        content: data.content,
        files: data.files,
        announcementId: announcementId,
      });
    } else {
      addAnnouncementMutation.mutate({
        title: data.title,
        content: data.content,
        files: data.files,
        created_by: userProfile?.id,
      });
    }

    form.reset();
    setCurrentFiles([]);
    setSelectedFileTypes("None");
    setSelectedVideo("");
    setSelectedPDF("");
    setImagePreviews([]);
    setIsOpen(false);
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
        setImagePreviews(files.map((file) => file.url));
      };

      fetchFiles();
    }
  }, [files, form]);

  const handleRemoveFile = (index: number) => {
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    const filesValue = form.getValues("files") || [];
    const updatedFiles = (
      Array.isArray(filesValue) ? filesValue : [filesValue]
    ).filter((_, i) => i !== index);

    form.setValue("files", updatedFiles);
    setCurrentFiles(updatedFiles);

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setCurrentFiles([]);
          setImagePreviews([]);
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
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      id="file-input"
                      type="file"
                      accept={
                        selectedFileType === "Image(s)"
                          ? "image/*"
                          : selectedFileType === "Video"
                          ? "video/*"
                          : "application/*"
                      }
                      className="hidden"
                      multiple={selectedFileType === "Image(s)"}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;

                        if (selectedFileType === "Image(s)") {
                          const fileArray = Array.from(files);

                          field.onChange([...currentFiles, ...fileArray]);
                          setCurrentFiles((prevState) => [
                            ...prevState,
                            ...fileArray,
                          ]);

                          setImagePreviews((prevState) => [
                            ...prevState,
                            ...fileArray.map((file) =>
                              URL.createObjectURL(file)
                            ),
                          ]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        } else {
                          const file = files[0];
                          if (file) {
                            const url = URL.createObjectURL(file);

                            if (file.type.startsWith("application")) {
                              setSelectedPDF(url);
                            } else {
                              setSelectedVideo(url);
                            }

                            form.setValue("files", [file]);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }
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
                      setImagePreviews([]);
                      setSelectedFileTypes(value);
                      setCurrentFiles([]);
                      setSelectedVideo("");
                      setSelectedPDF("");
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

              {selectedFileType === "Image(s)" && (
                <div className="flex max-h-[120px] w-full max-w-[420px] gap-3 overflow-x-scroll">
                  {imagePreviews.map((url, index) => (
                    <div
                      key={index}
                      className="relative flex h-[100px] w-[100px] flex-shrink-0 rounded-md border overflow-hidden"
                    >
                      <ImageLoader
                        className="object-cover"
                        src={url}
                        alt="an image"
                      />
                      <Icon
                        onClick={() => handleRemoveFile(index)}
                        className="absolute h-6 w-6 right-1 top-1 text-xl text-red-500 rounded-full p-1 hover:cursor-pointer "
                        icon={"mingcute:close-circle-fill"}
                      />
                    </div>
                  ))}
                  <Label htmlFor="file-input">
                    <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md border  hover:cursor-pointer  transition-colors">
                      <Icon className="h-9 w-9 " icon={"mingcute:add-line"} />
                    </div>
                  </Label>
                </div>
              )}

              {selectedFileType === "Video" &&
                (selectedVideo ? (
                  <div className="flex max-h-[110px] w-full max-w-[420px] justify-center gap-3 overflow-x-scroll">
                    <div className="relative flex h-[100px] w-[100px] flex-shrink-0 rounded-md border  overflow-hidden">
                      <video
                        controls={true}
                        src={selectedVideo}
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <Label htmlFor="file-input">
                    <div className="flex h-[110px] flex-col items-center justify-center hover:cursor-pointer hover:bg-school-200 transition-colors rounded-lg">
                      <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                        <Icon
                          className="h-11 w-11 "
                          icon={"mingcute:video-fill"}
                        />
                      </div>
                      <p className="text-[12px] font-semibold ">Upload Video</p>
                    </div>
                  </Label>
                ))}
              {selectedFileType === "PDF Document" &&
                (selectedPDF ? (
                  <div className="flex max-h-[110px] w-full max-w-[420px] items-center justify-center gap-3 overflow-x-scroll">
                    <div className="relative h-[100px] w-[100px] flex-shrink-0 rounded-md border  bg-school-200 flex items-center justify-center">
                      <Icon
                        className="h-11 w-11 "
                        icon={"mingcute:attachment-2-fill"}
                      />
                      <p className="text-xs  absolute bottom-1 left-1 right-1 truncate">
                        {(() => {
                          const files = form.getValues("files");
                          const fileArray = Array.isArray(files)
                            ? files
                            : [files];
                          return fileArray[0]?.name || "Unknown file";
                        })()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Label htmlFor="file-input">
                    <div className="flex h-[110px] flex-col items-center justify-center hover:cursor-pointer hover:bg-school-200 transition-colors rounded-lg">
                      <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                        <Icon
                          className="h-11 w-11 "
                          icon={"mingcute:attachment-2-fill"}
                        />
                      </div>
                      <p className="text-[12px] font-semibold ">Upload File</p>
                    </div>
                  </Label>
                ))}
            </div>
            {form.formState.errors.files && (
              <p className="text-sm font-medium text-red-600 mb-4">
                {form.formState.errors.files.message}
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel className="  flex-1">Cancel</AlertDialogCancel>
              <Button
                className="flex-1 bg-school-600 hover:bg-school-700 text-white"
                type="submit"
              >
                {addAnnouncementMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AnnouncementForm;
