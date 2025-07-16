import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  fetchAllClasses,
  fetchStudentsPerClass,
} from "@/services/class.service";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useMemo } from "react";
import { getInitial } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddStudentToClass from "@/components/classes/AddStudentToClass";
import EditClassForm from "@/components/classes/EditClassForm";
import DeleteClassForm from "@/components/classes/DeleteClassForm";

type SchoolYearIdProp = {
  schoolYearId: string;
};

function Classes({ schoolYearId }: SchoolYearIdProp) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

  const {
    data: classes,
    isLoading: isClassesLoading,
    error: isClassError,
  } = useQuery({
    queryKey: ["classes", schoolYearId],
    queryFn: () => fetchAllClasses(schoolYearId),
  });

  const selectedClass = classes?.find((c) => c.id === selectedClassId);

  // Find the classes for edit purposes
  const editingClass = useMemo(
    () => classes?.find((c) => c.id === editingClassId),
    [classes, editingClassId]
  );

  // Find the class for delete purposes
  const deletingClass = useMemo(
    () => classes?.find((c) => c.id === deletingClassId),
    [classes, deletingClassId]
  );

  if (isClassError) {
    console.error("Error fetching classes:", isClassError.message);
    return <p className="text-red-500">Failed to load classes.</p>;
  }

  return (
    <>
      {isClassesLoading ? (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <Dialog
              key={cls.id}
              onOpenChange={(open) => !open && setSelectedClassId(null)}
            >
              <DialogTrigger asChild>
                <Card
                  className={`cursor-pointer shadow-sm transition-all hover:shadow-md`}
                  onClick={() => setSelectedClassId(cls.id)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">
                      {cls.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClassId(cls.id);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingClassId(cls.id);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              {selectedClass?.id && (
                <StudentListInClass
                  classesName={cls.name}
                  selectedClass={selectedClass.id}
                  schoolYearId={schoolYearId}
                />
              )}
            </Dialog>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No classes found.</p>
      )}

      {/* Edit Class Dialog */}
      {editingClass && (
        <EditClassForm
          classId={editingClass.id}
          className={editingClass.name}
          schoolYearId={schoolYearId}
          open={!!editingClassId}
          onOpenChange={(open) => !open && setEditingClassId(null)}
        />
      )}

      {/* Delete Class Dialog  */}
      {deletingClass && (
        <DeleteClassForm
          classId={deletingClass.id}
          className={deletingClass.name}
          schoolYearId={schoolYearId}
          open={!!deletingClassId}
          onOpenChange={(open) => !open && setDeletingClassId(null)}
        />
      )}
    </>
  );
}

type StudentListInClassProp = {
  schoolYearId: string;
  selectedClass: string;
  classesName: string;
};

function StudentListInClass({
  schoolYearId,
  selectedClass,
  classesName,
}: StudentListInClassProp) {
  const {
    data: students,
    isLoading: isStudentsLoading,
    error: isStudentsError,
  } = useQuery({
    queryKey: ["students-per-class", selectedClass],
    queryFn: () => fetchStudentsPerClass(selectedClass),
    enabled: !!selectedClass,
  });

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{classesName} Students</DialogTitle>
        <DialogDescription>
          View and manage students enrolled in {classesName}.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <AddStudentToClass
          schoolYearId={schoolYearId}
          classId={selectedClass}
        />
        {isStudentsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="text-gray-500">Loading students...</span>
          </div>
        ) : isStudentsError ? (
          <p className="text-red-500">
            Failed to load students for this class.
          </p>
        ) : students && students.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="https://avatar.iran.liara.run/public" />
                          <AvatarFallback>{`${getInitial(
                            student.first_name
                          )} ${getInitial(student.last_name)}`}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">
                          {`${student.first_name} ${student.last_name}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          <DropdownMenuItem>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No students in this class.
          </p>
        )}
      </div>
    </DialogContent>
  );
}

export default Classes;
