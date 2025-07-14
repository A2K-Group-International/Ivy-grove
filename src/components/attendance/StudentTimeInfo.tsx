import { formatTime } from "@/lib/utils";
import type { Student } from "@/types/attendance";
import { LogIn, LogOut, Timer } from "lucide-react";

const StudentTimeInfo = ({
  attendance,
}: {
  attendance: Student["attendance"];
}) => {
  const timeIn = attendance[0]?.time_in;
  const timeOut = attendance[0]?.time_out;

  return (
    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
      {timeIn && (
        <div className="flex items-center gap-1">
          <LogIn className="h-3 w-3" />
          <span>In: {formatTime(new Date(`1970-01-01T${timeIn}`))}</span>
        </div>
      )}
      {timeOut && (
        <div className="flex items-center gap-1">
          <LogOut className="h-3 w-3" />
          <span>Out: {formatTime(new Date(`1970-01-01T${timeOut}`))}</span>
        </div>
      )}
      {timeIn && timeOut && (
        <div className="flex items-center gap-1">
          <Timer className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default StudentTimeInfo;
