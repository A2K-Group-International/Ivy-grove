import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  StudentService,
  type StudentProfile,
} from "@/services/students.service";

// Query keys for caching
export const STUDENT_KEYS = {
  all: ["students"] as const,
  paginated: (page: number, pageSize: number, schoolYearId?: string) =>
    ["students", "paginated", page, pageSize, schoolYearId] as const,
  detail: (id: string) => ["school-students", id] as const,
};

export interface CreateStudentData {
  first_name: string;
  last_name: string;
  age: number;
  school_year_id: string;
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      studentData: CreateStudentData
    ): Promise<StudentProfile> => {
      return StudentService.createStudent(
        studentData.first_name,
        studentData.last_name,
        studentData.age,
        studentData.school_year_id
      );
    },
    onSuccess: () => {
      // Invalidate all student-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
    },
    onError: (error) => {
      console.error("Failed to create stduent:", error);
    },
  });
}

//  fetching students with pagination
export function useGetStudents(page: number = 1, pageSize: number = 10, schoolYearId?: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.paginated(page, pageSize, schoolYearId),
    queryFn: () => StudentService.fetchStudents(page, pageSize, schoolYearId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
