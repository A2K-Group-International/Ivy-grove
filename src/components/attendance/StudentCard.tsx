import { getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Student } from "@/types/attendance";
import StudentTimeInfo from "./StudentTimeInfo";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const StudentCard = ({
  student,
  onCheckIn,
  onCheckOut,
  onTimeEdit,
  isStudentLoading,
}: {
  student: Student;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  onTimeEdit: (
    attendanceId: string,
    timeType: "time_in" | "time_out",
    newTime: string
  ) => void;
  isStudentLoading: (id: string) => boolean;
}) => {
  const timeIn = student.attendance[0]?.time_in;
  const timeOut = student.attendance[0]?.time_out;

  const StudentStatus = () => {
    if (timeIn && timeOut) {
      return <Badge className="bg-blue-500">Checked out</Badge>;
    }
    if (timeIn && !timeOut) {
      return <Badge className="bg-blue-500">Checked in</Badge>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-y-2 p-4 rounded-lg border bg-white hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={"/placeholder.svg"} />
          <AvatarFallback className="text-sm font-medium">
            {getInitial(student.students.first_name)}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="font-medium text-gray-900">
            {student.students.first_name} {student.students.last_name}
          </div>
          <StudentTimeInfo
            attendance={student.attendance}
            onTimeEdit={onTimeEdit}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StudentStatus />
        <div className="flex gap-2">
          {!timeIn && (
            <Button
              onClick={() => onCheckIn(student.id)}
              disabled={isStudentLoading(student.id)}
              size="sm"
              className="flex items-center gap-1"
            >
              <LogIn className="h-4 w-4" />
              {isStudentLoading(student.id) ? "Checking In..." : "Check In"}
            </Button>
          )}

          {timeIn && !timeOut && (
            <Button
              onClick={() => onCheckOut(student.id)}
              size="sm"
              disabled={isStudentLoading(student.id)}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              {isStudentLoading(student.id) ? "Checking Out..." : "Check Out"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default StudentCard;
