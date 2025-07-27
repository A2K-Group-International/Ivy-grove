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
import { useGroups } from "@/hooks/groups/useGroups";
import type { Group } from "@/pages/Protected/Groups";

interface DeleteGroupProps {
  group: Group;
  onOpenChange: (open: boolean) => void;
}

const DeleteGroup = ({ group, onOpenChange }: DeleteGroupProps) => {
  const { deleteGroup, isDeleting } = useGroups();

  const handleDelete = () => {
    deleteGroup(group.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={true} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Group</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{group.name}"? This action cannot
            be undone and will permanently remove all messages and data
            associated with this group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Group"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGroup;
