import { useQuery } from "@tanstack/react-query";
import { fetchStudentsByClassWithStatus } from "@/services/class.service";
import { format } from "date-fns";

export const useAttendanceData = (classId: string, date?: Date) => {
  // Format the date to match it on date object in supabase
  const formatDate = date
    ? format(date, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["students", classId, formatDate],
    queryFn: async () =>
      await fetchStudentsByClassWithStatus(classId, formatDate),
    enabled: !!classId,
  });
};
