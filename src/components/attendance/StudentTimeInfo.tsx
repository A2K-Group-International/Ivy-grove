import { formatTime } from "@/lib/utils";
import type { Student } from "@/types/attendance";
import { LogIn, LogOut, Timer, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const StudentTimeInfo = ({
  attendance,
  onTimeEdit,
}: {
  attendance: Student["attendance"];
  onTimeEdit?: (
    attendanceId: string,
    timeType: "time_in" | "time_out",
    newTime: string
  ) => void;
}) => {
  const timeIn = attendance[0]?.time_in;
  const timeOut = attendance[0]?.time_out;
  const attendanceId = attendance[0]?.id;

  const [editingTimeIn, setEditingTimeIn] = useState(false);
  const [editingTimeOut, setEditingTimeOut] = useState(false);
  const [tempTimeIn, setTempTimeIn] = useState(timeIn || "");
  const [tempTimeOut, setTempTimeOut] = useState(timeOut || "");

  const handleSaveTimeIn = () => {
    if (onTimeEdit && attendanceId) {
      onTimeEdit(attendanceId, "time_in", tempTimeIn);
    }
    setEditingTimeIn(false);
  };

  const handleSaveTimeOut = () => {
    if (onTimeEdit && attendanceId) {
      onTimeEdit(attendanceId, "time_out", tempTimeOut);
    }
    setEditingTimeOut(false);
  };

  const handleCancelTimeIn = () => {
    setTempTimeIn(timeIn || "");
    setEditingTimeIn(false);
  };

  const handleCancelTimeOut = () => {
    setTempTimeOut(timeOut || "");
    setEditingTimeOut(false);
  };

  return (
    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
      {timeIn && (
        <div className="flex items-center gap-1">
          <LogIn className="h-3 w-3" />
          {editingTimeIn ? (
            <div className="flex items-center gap-1">
              <span>In:</span>
              <Input
                type="time"
                value={tempTimeIn}
                onChange={(e) => setTempTimeIn(e.target.value)}
                className="h-6 w-20 text-xs"
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={handleSaveTimeIn}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={handleCancelTimeIn}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>In: {formatTime(new Date(`1970-01-01T${timeIn}`))}</span>
              {onTimeEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={() => setEditingTimeIn(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      {timeOut && (
        <div className="flex items-center gap-1">
          <LogOut className="h-3 w-3" />
          {editingTimeOut ? (
            <div className="flex items-center gap-1">
              <span>Out:</span>
              <Input
                type="time"
                value={tempTimeOut}
                onChange={(e) => setTempTimeOut(e.target.value)}
                className="h-6 w-20 text-xs"
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={handleSaveTimeOut}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0"
                onClick={handleCancelTimeOut}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>Out: {formatTime(new Date(`1970-01-01T${timeOut}`))}</span>
              {onTimeEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={() => setEditingTimeOut(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
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
