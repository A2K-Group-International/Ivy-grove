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
import { useDeleteStudent } from "@/hooks/useStudent";
import { toast } from "sonner";
import type { StudentProfile } from "@/services/students.service";
import { Loader } from "lucide-react";

type DeleteStudentProps = {
  student: StudentProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteStudent({ student, open, onOpenChange }: DeleteStudentProps) {
  const { mutate: deleteStudent, isPending } = useDeleteStudent();

  const handleDelete = () => {
    deleteStudent(student.id, {
      onSuccess: () => {
        toast.success(`Student "${student.first_name} ${student.last_name}" deleted successfully!`);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to delete student", {
          description: error.message,
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {student.first_name} {student.last_name}
            </span>
            ? This action cannot be undone and will remove the student from all
            classes and attendance records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? (
              <div className="flex items-center gap-x-2">
                <Loader className="animate-spin h-4 w-4" />
                Deleting...
              </div>
            ) : (
              "Delete Student"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}