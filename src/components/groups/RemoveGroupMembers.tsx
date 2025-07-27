import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGroupMembers } from "@/hooks/groups/useGroupMembers";

interface AddGroupMembersProps {
  groupId: string;
  userId: string;
}

const RemoveGroupMembers = ({ groupId, userId }: AddGroupMembersProps) => {
  const [open, setOpen] = useState(false);
  console.log(groupId, userId);

  const { removeMember, isRemoving, removeError } = useGroupMembers(groupId);

  const handleRemoveMember = (id: string) => {
    removeMember(id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Icon icon="mingcute:minus-circle-fill" color="red" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to remove this member?
          </DialogTitle>
          <DialogDescription className="sr-only">
            Remove user to this group.
          </DialogDescription>
          {removeError && (
            <p className="text-red-500 text-sm mt-2">{removeError.message}</p>
          )}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleRemoveMember(userId)}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveGroupMembers;
