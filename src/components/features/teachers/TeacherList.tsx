import { useState } from "react";
import { useTeachers } from "@/hooks/useTeacher";
import type { UserProfile } from "@/services/user.service";
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
import { EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { EditTeacher } from "./EditTeacher";
import { DeleteTeacher } from "./DeleteTeacher";

interface TeacherListProps {
  isActive: boolean;
}

export function TeacherList({ isActive }: TeacherListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: teachers, error } = useTeachers(
    isActive ? currentPage : 1,
    pageSize
  );

  if (!isActive) return null;

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error loading teachers: {error.message}
        </div>
      </div>
    );
  }

  if (!teachers || teachers.items.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-school-800">No teachers found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Teachers Grid */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-h-dvh">
        {teachers.items.map((teacher: UserProfile) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>

      {/* Pagination */}
      {teachers.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={teachers.totalPages}
          onPageChange={setCurrentPage}
          totalItems={teachers.totalItems}
        />
      )}
    </div>
  );
}

interface TeacherCardProps {
  teacher: UserProfile;
}

function TeacherCard({ teacher }: TeacherCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex gap-x-2 justify-between">
        <div>
          <Avatar className="size-14">
            <AvatarImage src="https://plus.unsplash.com/premium_photo-1739786996040-32bde1db0610?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex gap-x-2 items-center">
            <Label className="font-semibold text-lg text-school-700">
              {teacher.first_name} {teacher.last_name}
            </Label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-school-200 text-school-600">
              {capitalizeFirstLetter(teacher.role)}
            </span>
          </div>
          <Label className="text-sm text-gray-500">{teacher.email}</Label>
          <Label className="text-sm text-gray-500">{teacher.contact}</Label>
        </div>
        <ActionButtons
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteOpen(true)}
        />
      </div>

      <EditTeacher
        teacher={teacher}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <DeleteTeacher
        teacher={teacher}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
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
