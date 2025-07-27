import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { useDeleteTeacher } from "@/hooks/useTeacher";
import type { UserProfile } from "@/services/user.service";

interface DeleteTeacherProps {
  teacher: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteTeacher({
  teacher,
  isOpen,
  onClose,
}: DeleteTeacherProps) {
  const { mutate: deleteTeacher, isPending } = useDeleteTeacher();

  const handleDeleteTeacher = () => {
    deleteTeacher(teacher.id, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Failed to delete teacher:", error);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {teacher.first_name} {teacher.last_name}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDeleteTeacher}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-x-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-x-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Teacher
                </div>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
