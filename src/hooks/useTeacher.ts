import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService, type UserProfile } from "@/services/auth.service";

// Query keys for caching
export const TEACHER_KEYS = {
  all: ["teachers"] as const,
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
    onSuccess: (newTeacher) => {
      queryClient.setQueryData(
        TEACHER_KEYS.all,
        (old: UserProfile[] | undefined) => {
          if (!old) return [newTeacher];
          return { ...onload, newTeacher };
        }
      );

      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
    },
    onError: (error) => {
      console.error("Failed to create teacher:", error);
    },
  });
}
