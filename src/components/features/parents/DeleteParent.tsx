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
import { Loader, Trash2 } from "lucide-react";
import { useDeleteParent } from "@/hooks/useParents";
import type { UserProfile } from "@/services/user.service";

interface DeleteParentProps {
  parent: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteParent({ parent, isOpen, onClose }: DeleteParentProps) {
  const { mutate: deleteParent, isPending } = useDeleteParent();

  const handleDelete = () => {
    deleteParent(parent.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Delete Parent
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <div>
              Are you sure you want to delete{" "}
              <strong>
                {parent.first_name} {parent.last_name}
              </strong>
              ?
            </div>
            <div className="mt-4">
              <span className="text-amber-600 font-medium">
                ⚠️ This action will:
              </span>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
                <li>Permanently remove the parent from the system</li>
                <li>Unlink all students currently assigned to this parent</li>
                <li>Cannot be undone</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin w-4 h-4" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Parent
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
