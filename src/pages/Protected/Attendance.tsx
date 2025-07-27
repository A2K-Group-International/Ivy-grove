import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

// import AddStudentForm from "@/components/attendance/AddStudentForm";
import StudentCard from "@/components/attendance/StudentCard";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import ErrorMessage from "@/components/ErrorMessage";
import AttendanceStatsSkeleton from "@/components/skeletons.tsx/AttendanceStatsSkeleton";
import StudentsListSkeleton from "@/components/skeletons.tsx/StudentsListSkeleton";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useAttendanceActions } from "@/hooks/attendance/useAttendanceActions";
import { useAttendanceData } from "@/hooks/attendance/useAttendanceData";
import { useClassData } from "@/hooks/attendance/useClassData";
import { useClassSelection } from "@/hooks/attendance/useClassSelection";
import QRScanner from "@/components/attendance/QRScanner";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // State for the date
  const { classId, setClassId } = useClassSelection(); // Class ID on params

  // Fetch classes
  const {
    data: classes,
    isLoading: classLoading,
    isError: classIsError,
    error: classError,
  } = useClassData();

  // Fetch the students base on class id and selected date for Attendance
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useAttendanceData(classId, selectedDate);

  const {
    handleCheckIn,
    handleCheckOut,
    handleTimeEdit,
    isStudentLoading,
    handleDeleteAttendance,
  } = useAttendanceActions(classId, selectedDate);

  return (
    <>
      {/* Top Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[200px]",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>

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

        <div className="flex gap-2">
          {/* QR SCANNER /> */}
          <QRScanner />
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="mb-4">
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
      </div>

      {/* Search Bar */}
      {/* <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students by name, ID, or email..."
          className="pl-10"
        />
      </div> */}

      {/* Scrollable Student List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {!classId ? (
          <div className="text-center py-8 text-gray-500">
            Please select a class to view students
          </div>
        ) : isLoading ? (
          <StudentsListSkeleton />
        ) : isError ? (
          <ErrorMessage message={`Error loading students: ${error?.message}`} />
        ) : students && students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onTimeEdit={handleTimeEdit}
              onDeleteAttendance={handleDeleteAttendance}
              isStudentLoading={isStudentLoading}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No students found for this class
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
