import { useQuery } from "@tanstack/react-query";
import { fetchStudentsByClassWithStatus } from "@/services/class.service";
import { formatDateForSupabase } from "@/lib/utils";

export const useAttendanceData = (classId: string, date?: Date) => {
  const dateString = date ? formatDateForSupabase(date) : formatDateForSupabase(new Date());
  
  return useQuery({
    queryKey: ["students", classId, dateString],
    queryFn: async () => await fetchStudentsByClassWithStatus(classId, dateString),
    enabled: !!classId,
  });
};
