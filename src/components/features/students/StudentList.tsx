import { useState } from "react";
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
import { useGetStudents } from "@/hooks/useStudent";
import type { StudentProfile } from "@/services/students.service";

interface StudentListProps {
  isActive: boolean;
  schoolYearId?: string;
}

export function StudentList({ isActive, schoolYearId }: StudentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: students,
    isLoading,
    error,
  } = useGetStudents(isActive ? currentPage : 1, pageSize, schoolYearId);

  if (!isActive) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-school-800">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error loading students: {error.message}
        </div>
      </div>
    );
  }

  if (!students || students.items.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-school-800">No students found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* student Grid */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-h-dvh">
        {students.items.map((student: StudentProfile) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Pagination */}
      {students.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={students.totalPages}
          onPageChange={setCurrentPage}
          totalItems={students.totalItems}
        />
      )}
    </div>
  );
}

interface StudentCardProps {
  student: StudentProfile;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex gap-x-2 justify-between">
        <div>
          <Avatar className="size-14">
            <AvatarImage src="https://avatar.iran.liara.run/public" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <Label className="font-semibold text-lg text-school-700">
              {student.first_name} {student.last_name}
            </Label>
            <span className="text-gray-500 font-medium text-sm">
              Age: {student.age}
            </span>
          </div>
        </div>
        <ActionButtons />
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

function ActionButtons() {
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
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
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
