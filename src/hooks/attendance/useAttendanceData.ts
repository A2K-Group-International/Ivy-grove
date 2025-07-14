import { useQuery } from "@tanstack/react-query";
import { fetchStudentsByClassWithStatus } from "@/services/class.service";

export const useAttendanceData = (classId: string) => {
  return useQuery({
    queryKey: ["students", classId],
    queryFn: async () => await fetchStudentsByClassWithStatus(classId),
    enabled: !!classId,
  });
};
