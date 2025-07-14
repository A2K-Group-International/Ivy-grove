import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendStudent, timeOutStudent } from "@/services/attendance.service";
import { toast } from "sonner";

export const useAttendanceActions = (classId: string) => {
  const queryClient = useQueryClient();

  const attendMutation = useMutation({
    mutationFn: attendStudent,
    onSuccess: () => {
      toast("Attendance updated successfully!");
    },
    onError: (error) => {
      toast(`Error updating attendance: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["students", classId] });
    },
  });

  const timeOutMutation = useMutation({
    mutationFn: timeOutStudent,
    onSuccess: () => {
      toast("Checked out successfully!");
    },
    onError: (error) => {
      toast(`Error checking out: ${error.message}`, {
        className: "bg-red-500 text-white",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["students", classId] });
    },
  });

  const handleCheckIn = (studentId: string) => {
    attendMutation.mutate(studentId);
  };

  const handleCheckOut = (studentId: string) => {
    timeOutMutation.mutate(studentId);
  };

  return {
    handleCheckIn,
    handleCheckOut,
    isCheckingIn: attendMutation.isPending,
    isCheckingOut: timeOutMutation.isPending,
  };
};
