import { useState } from "react";
import { useParentsWithStudents } from "@/hooks/useParents";
import type { ParentWithStudents } from "@/services/user.service";
import { capitalizeFirstLetter } from "@/lib/string";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  Home,
  MailIcon,
  Phone,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { StudentLinkModal } from "./StudentLinkModal";
import { EditParent } from "./EditParent";
import { DeleteParent } from "./DeleteParent";
import { calculateAge } from "@/utils/date";

interface ParentListProps {
  isActive: boolean;
}

export function ParentList({ isActive }: ParentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: parents,
    isLoading,
    error,
  } = useParentsWithStudents(isActive ? currentPage : 1, pageSize);

  if (!isActive) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-school-800">Loading parents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error loading parents: {error.message}
        </div>
      </div>
    );
  }

  if (!parents || parents.items.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-school-800">No parents found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Parents Grid */}
      <div className="grid gap-4 max-h-dvh">
        {parents.items.map((parent: ParentWithStudents) => (
          <ParentCard key={parent.id} parent={parent} />
        ))}
      </div>

      {/* Pagination */}
      {parents.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={parents.totalPages}
          onPageChange={setCurrentPage}
          totalItems={parents.totalItems}
        />
      )}
    </div>
  );
}

interface ParentCardProps {
  parent: ParentWithStudents;
}

function ParentCard({ parent }: ParentCardProps) {
  const [studentLinkModalOpen, setStudentLinkModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col gap-y-2">
      <div className="flex gap-x-2 justify-between">
        <div>
          <Avatar className="size-14">
            <AvatarImage src="https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <Label className="font-semibold text-lg text-school-700">
              {parent.first_name} {parent.last_name}
            </Label>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-school-200 text-school-600">
                {capitalizeFirstLetter(parent.role)}
              </span>
            </div>
          </div>
        </div>
        <ActionButtons
          onEdit={() => setEditModalOpen(true)}
          onDelete={() => setDeleteModalOpen(true)}
        />
      </div>
      <div className="space-y-1 flex gap-x-10 flex-col gap-y-5 md:flex-row">
        <div className="space-y-2 flex-1">
          <Label className="text-lg text-gray-600">Contact Information:</Label>
          <Label className="text-sm text-gray-500">
            <MailIcon size={18} /> {parent.email}
          </Label>
          <Label className="text-sm text-gray-500">
            <Phone size={18} />
            {parent.contact}
          </Label>
          <Label className="text-sm text-gray-500">
            <Home size={18} />
            {parent.address.trim() !== ""
              ? parent.address
              : "No address provided"}
          </Label>
        </div>
        {/* Student List */}
        <div className="flex-1">
          <div className="flex items-center gap-x-2">
            <Label className="text-lg text-gray-600">
              Student(s) ({parent.students.length})
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStudentLinkModalOpen(true)}
              className="text-green-600 hover:text-green-700 p-1"
              title="Manage student links"
            >
              <Plus size={18} />
            </Button>
          </div>

          <div className="space-y-2">
            {parent.students.length === 0 ? (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No students linked</p>
              </div>
            ) : (
              parent.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback className="bg-green-100 text-school-600 text-xs">
                      {student.first_name[0]}
                      {student.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {student.first_name} {student.last_name}
                    </p>
                    {student.date_of_birth && (
                      <p className="text-xs text-gray-600">
                        Age {calculateAge(student.date_of_birth)}
                      </p>
                    )}
                    {/* <p className="text-xs text-gray-600">Age {student.age}</p> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <StudentLinkModal
        parentId={parent.id}
        parentName={`${parent.first_name} ${parent.last_name}`}
        linkedStudents={parent.students}
        isOpen={studentLinkModalOpen}
        onClose={() => setStudentLinkModalOpen(false)}
      />

      <EditParent
        parent={parent}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

      <DeleteParent
        parent={parent}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * 10, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
