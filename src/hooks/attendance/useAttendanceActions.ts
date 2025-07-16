import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendStudent, timeOutStudent, updateAttendanceTime } from "@/services/attendance.service";
import { toast } from "sonner";
import { useState } from "react";
import { formatDateForSupabase } from "@/lib/utils";

export const useAttendanceActions = (classId: string, date?: Date) => {
  const queryClient = useQueryClient();
  const [loadingStudents, setLoadingStudents] = useState<Set<string>>(
    new Set()
  );
  const dateString = date
    ? formatDateForSupabase(date)
    : formatDateForSupabase(new Date());

  const attendMutation = useMutation({
    mutationFn: (studentId: string) => attendStudent(studentId, date),
    onMutate: (studentId: string) => {
      setLoadingStudents((prev) => new Set(prev).add(studentId));
    },
    onSuccess: () => {
      toast("Attendance updated successfully!");
    },
    onError: (error) => {
      toast(`Error updating attendance: ${error.message}`);
    },
    onSettled: (_data, _error, studentId) => {
      setLoadingStudents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
      queryClient.invalidateQueries({
        queryKey: ["students", classId, dateString],
      });
    },
  });

  const timeOutMutation = useMutation({
    mutationFn: (studentId: string) => timeOutStudent(studentId, date),
    onMutate: (studentId: string) => {
      setLoadingStudents((prev) => new Set(prev).add(studentId));
    },
    onSuccess: () => {
      toast("Checked out successfully!");
    },
    onError: (error) => {
      toast(`Error checking out: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
    onSettled: (_data, _error, studentId) => {
      setLoadingStudents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
      queryClient.invalidateQueries({
        queryKey: ["students", classId, dateString],
      });
    },
  });

  const handleCheckIn = (studentId: string) => {
    attendMutation.mutate(studentId);
  };

  const handleCheckOut = (studentId: string) => {
    timeOutMutation.mutate(studentId);
  };

  const timeEditMutation = useMutation({
    mutationFn: ({ attendanceId, timeType, newTime }: { 
      attendanceId: string; 
      timeType: 'time_in' | 'time_out'; 
      newTime: string 
    }) => updateAttendanceTime(attendanceId, timeType, newTime),
    onSuccess: () => {
      toast("Time updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["students", classId, dateString],
      });
    },
    onError: (error) => {
      toast(`Error updating time: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleTimeEdit = (attendanceId: string, timeType: 'time_in' | 'time_out', newTime: string) => {
    timeEditMutation.mutate({ attendanceId, timeType, newTime });
  };

  const isStudentLoading = (studentId: string) => {
    return loadingStudents.has(studentId);
  };

  return {
    handleCheckIn,
    handleCheckOut,
    handleTimeEdit,
    isStudentLoading,
  };
};
