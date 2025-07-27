import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";

export const AUTH_KEYS = {
  session: ["auth", "session"] as const,
  profile: (id: string) => ["auth", "profile", id] as const,
};

/**
 * Hook to get current session
 */
export function useSession() {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: AuthService.getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get user profile
 */
export function useUserProfile(id: string | undefined) {
  return useQuery({
    queryKey: AUTH_KEYS.profile(id || ""),
    queryFn: () => AuthService.fetchUserProfile(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to invalidate auth queries
 */
export function useAuthQueries() {
  const queryClient = useQueryClient();

  const invalidateSession = () => {
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
  };

  const invalidateProfile = (id: string) => {
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile(id) });
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  return {
    invalidateSession,
    invalidateProfile,
    invalidateAll,
  };
}
