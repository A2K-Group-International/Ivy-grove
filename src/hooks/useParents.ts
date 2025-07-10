import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService, type UserProfile } from "@/services/auth.service";
import {
  UserService,
  type FetchParentNoPagination,
} from "@/services/user.service";

// Query keys for caching
export const PARENTS_KEY = {
  all: ["parents"] as const,
  paginated: (page: number, pageSize: number) =>
    ["parents", "paginated", page, pageSize] as const,
  detail: (id: string) => ["parents", id] as const,
};

// Interface for creating a parent
export interface CreateParentData {
  email: string;
  password: string;
  contact: string;
  first_name: string;
  last_name: string;
}

//  fetching users with pagination
export function useParents(page: number = 1, pageSize: number = 1) {
  return useQuery({
    queryKey: PARENTS_KEY.paginated(page, pageSize),
    queryFn: () => UserService.fetchParents(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parentData: CreateParentData): Promise<UserProfile> => {
      return AuthService.createParent(
        parentData.email,
        parentData.password,
        parentData.contact,
        parentData.first_name,
        parentData.last_name
      );
    },
    onSuccess: () => {
      // Invalidate all parent-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: PARENTS_KEY.all });
      // Also invalidate paginated queries
      queryClient.invalidateQueries({ queryKey: ["parents", "paginated"] });
    },
    onError: (error) => {
      console.error("Failed to create parent:", error);
    },
  });
}

export function useFetchParentsNoPagination() {
  return useQuery<FetchParentNoPagination[]>({
    queryKey: PARENTS_KEY.all,
    queryFn: UserService.fetchParentsNoPagination,
  });
}
