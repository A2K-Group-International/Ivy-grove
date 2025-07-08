import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  StudentService,
  type StudentProfile,
} from "@/services/students.service";

// Query keys for caching
export const STUDENT_KEYS = {
  all: ["students"] as const,
  detail: (id: string) => ["school-students", id] as const,
};

export interface CreateStudentData {
  first_name: string;
  last_name: string;
  age: number;
  school_year_id: string;
  parent_id: string;
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
        studentData.school_year_id,
        studentData.parent_id
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
