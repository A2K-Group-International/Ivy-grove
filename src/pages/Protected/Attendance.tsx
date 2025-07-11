import AddStudentForm from "@/components/attendance/AddStudentForm";
import StudentCard from "@/components/attendance/StudentCard";
import ErrorMessage from "@/components/ErrorMessage";
import AttendanceStatsSkeleton from "@/components/skeletons.tsx/AttendanceStatsSkeleton";
import StudentsListSkeleton from "@/components/skeletons.tsx/StudentsListSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAttendanceActions } from "@/hooks/attendance/useAttendanceActions";
import { useAttendanceData } from "@/hooks/attendance/useAttendanceData";
import { useClassData } from "@/hooks/attendance/useClassData";
import { useClassSelection } from "@/hooks/attendance/useClassSelection";
import { formatDate } from "@/lib/utils";
import { QrCode, Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AttendanceStats from "@/components/attendance/AttendanceStats";

const Attendance = () => {
  const { classId, setClassId } = useClassSelection();
  const {
    data: classes,
    isLoading: classLoading,
    isError: classIsError,
    error: classError,
  } = useClassData();
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useAttendanceData(classId);
  const { handleCheckIn, handleCheckOut, isCheckingIn, isCheckingOut } =
    useAttendanceActions(classId);

  return (
    <div className="flex h-full ">
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formatDate(new Date().toLocaleDateString())}
              </h2>
              <Select
                onValueChange={setClassId}
                value={classId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Classes</SelectLabel>
                    {classes && classes.length > 0 ? (
                      classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-classes" disabled>
                        No classes available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center gap-2">
              <AddStudentForm />
              <Button>
                <QrCode />
              </Button>
            </div>
          </div>

          {/* Attendance Stats */}
          {classLoading ? (
            <AttendanceStatsSkeleton />
          ) : classIsError ? (
            <ErrorMessage
              message={`Error loading classes: ${classError?.message}`}
            />
          ) : students ? (
            <AttendanceStats students={students} />
          ) : (
            <AttendanceStatsSkeleton />
          )}

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name, ID, or email..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Students List */}
        {!classId ? (
          <div className="text-center py-8 text-gray-500">
            Please select a class to view students
          </div>
        ) : isLoading ? (
          <StudentsListSkeleton />
        ) : isError ? (
          <ErrorMessage message={`Error loading students: ${error?.message}`} />
        ) : students && students.length > 0 ? (
          <div className="space-y-2">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                isCheckingIn={isCheckingIn}
                isCheckingOut={isCheckingOut}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No students found for this class
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
