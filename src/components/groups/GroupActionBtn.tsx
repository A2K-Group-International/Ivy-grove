import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import EditGroupForm from "./EditGroupForm";
import DeleteGroup from "./DeleteGroup";
import type { Group } from "@/pages/Protected/Groups";

interface GroupActionBtnProps {
  group: Group;
}

function GroupActionBtn({ group }: GroupActionBtnProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-0" 
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEditClick}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editOpen && (
        <EditGroupForm 
          group={group} 
          onOpenChange={setEditOpen} 
        />
      )}

      {deleteOpen && (
        <DeleteGroup 
          group={group} 
          onOpenChange={setDeleteOpen} 
        />
      )}
    </>
  );
}

export default GroupActionBtn;
