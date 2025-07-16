import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import {
  UserService,
  type UserProfile,
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
  address: string;
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
        parentData.last_name,
        parentData.address
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

export function useParentsWithStudents(
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["parents", "with-students", page, pageSize],
    queryFn: () => UserService.fetchParentsWithStudents(page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      first_name,
      last_name,
      contact,
      address,
    }: {
      id: string;
      first_name: string;
      last_name: string;
      contact: string;
      address: string;
    }): Promise<UserProfile> => {
      return UserService.updateParent(
        id,
        first_name,
        last_name,
        contact,
        address
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_KEY.all });
      queryClient.invalidateQueries({ queryKey: ["parents", "paginated"] });
      queryClient.invalidateQueries({ queryKey: ["parents", "with-students"] });
    },
    onError: (error) => {
      console.error("Failed to update parent:", error);
    },
  });
}

export function useDeleteParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return UserService.deleteParent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_KEY.all });
      queryClient.invalidateQueries({ queryKey: ["parents", "paginated"] });
      queryClient.invalidateQueries({ queryKey: ["parents", "with-students"] });
    },
    onError: (error) => {
      console.error("Failed to delete parent:", error);
    },
  });
}

export function useLinkStudentToParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      parentId,
    }: {
      studentId: string;
      parentId: string;
    }): Promise<void> => {
      return UserService.linkStudentToParent(studentId, parentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_KEY.all });
      queryClient.invalidateQueries({ queryKey: ["parents", "with-students"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Failed to link student to parent:", error);
    },
  });
}

export function useUnlinkStudentFromParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string): Promise<void> => {
      return UserService.unlinkStudentFromParent(studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_KEY.all });
      queryClient.invalidateQueries({ queryKey: ["parents", "with-students"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Failed to unlink student from parent:", error);
    },
  });
}

export function useUnlinkedStudents() {
  return useQuery({
    queryKey: ["students", "unlinked"],
    queryFn: UserService.getUnlinkedStudents,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
