import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteClass } from "@/services/class.service";

type DeleteClassFormProps = {
  classId: string;
  className: string;
  schoolYearId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DeleteClassForm = ({
  classId,
  className,
  schoolYearId,
  open,
  onOpenChange,
}: DeleteClassFormProps) => {
  const queryClient = useQueryClient();

  const deleteClassMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      toast("Class deleted successfully!");
    },
    onError: (error) => {
      toast("Something went wrong.", {
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes", schoolYearId],
      });
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    deleteClassMutation.mutate(classId);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Class</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the class "{className}"? This action
            cannot be undone and will remove all students from this class.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteClassMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteClassMutation.isPending ? "Deleting..." : "Delete Class"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteClassForm;