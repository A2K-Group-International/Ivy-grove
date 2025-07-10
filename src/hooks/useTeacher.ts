import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService, type UserProfile } from "@/services/auth.service";
import { UserService } from "@/services/user.service";

// Query keys for caching
export const TEACHER_KEYS = {
  all: ["teachers"] as const,
  paginated: (page: number, pageSize: number) =>
    ["teachers", "paginated", page, pageSize] as const,
  detail: (id: string) => ["teachers", id] as const,
};

// Interface for creating a teacher
export interface CreateTeacherData {
  email: string;
  password: string;
  contact: string;
  first_name: string;
  last_name: string;
}

//  fetching teachers with pagination
export function useTeachers(page: number = 1, pageSize: number = 1) {
  return useQuery({
    queryKey: TEACHER_KEYS.paginated(page, pageSize),
    queryFn: () => UserService.fetchTeachers(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      teacherData: CreateTeacherData
    ): Promise<UserProfile> => {
      return AuthService.createTeacher(
        teacherData.email,
        teacherData.password,
        teacherData.contact,
        teacherData.first_name,
        teacherData.last_name
      );
    },
    onSuccess: () => {
      // Invalidate all teacher-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
      // Also invalidate paginated queries
      queryClient.invalidateQueries({ queryKey: ["teachers", "paginated"] });
    },
    onError: (error) => {
      console.error("Failed to create teacher:", error);
    },
  });
}
