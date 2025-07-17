import { MapPin, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitial } from "@/lib/utils";
import { useGetStudents } from "@/hooks/useStudent";
import Loading from "@/components/Loading";
import { useState } from "react";
import { CreateStudents } from "@/components/features/students/CreateStudents";
import { EditStudent } from "@/components/features/students/EditStudent";
import { DeleteStudent } from "@/components/features/students/DeleteStudent";
import type { StudentProfile } from "@/services/students.service";

type StudentsTableProps = {
  schoolYearId: string;
};

const StudentsTable = ({ schoolYearId }: StudentsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(
    null
  );
  const [deletingStudent, setDeletingStudent] = useState<StudentProfile | null>(
    null
  );
  const pageSize = 10;
  // Fetch students per school year
  const {
    data: students,
    isLoading: isStudentsLoading,
    error: errorLoadingStudents,
  } = useGetStudents(currentPage, pageSize, schoolYearId);

  const handleNextPage = () => {
    if (students?.nextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isStudentsLoading) return <Loading />;

  if (errorLoadingStudents) return <div>Error loading students</div>;

  if (students?.items?.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No students found.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">
            Manage all students registered in the current school year
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <CreateStudents schoolYearId={schoolYearId} />
        </div>
      </div>
      <div className="table-responsive">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-200">
              <TableHead className="font-semibold text-gray-700">
                Student
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Age</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Address
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.items?.map((student) => (
              <TableRow
                key={student.id}
                className="hover:bg-gray-50 transition-colors duration-150 border-gray-100"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-school-100">
                      <AvatarImage src="https://images.unsplash.com/photo-1750535135593-3a8e5def331d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                      <AvatarFallback className="bg-school-50 text-school-700 font-semibold">
                        {`${getInitial(student.first_name)}${getInitial(
                          student.last_name
                        )}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {`${student.first_name} ${student.last_name}`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {student.age} years
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate-2">
                      {student.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="dropdown-enhanced"
                      >
                        <DropdownMenuItem
                          onClick={() => setEditingStudent(student)}
                          className="cursor-pointer hover:bg-school-50 text-gray-700"
                        >
                          <span className="text-sm">Edit Student</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingStudent(student)}
                          className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
                        >
                          <span className="text-sm">Delete Student</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, students?.totalItems || 0)} of{" "}
            {students?.totalItems || 0} students
          </span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={`${
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-school-50 hover:text-school-700 cursor-pointer"
                }`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive
                className="bg-school-600 text-white hover:bg-school-700"
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={`${
                  !students?.nextPage
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-school-50 hover:text-school-700 cursor-pointer"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <EditStudent
          student={editingStudent}
          open={!!editingStudent}
          onOpenChange={(open) => !open && setEditingStudent(null)}
        />
      )}

      {/* Delete Student Dialog */}
      {deletingStudent && (
        <DeleteStudent
          student={deletingStudent}
          open={!!deletingStudent}
          onOpenChange={(open) => !open && setDeletingStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentsTable;
