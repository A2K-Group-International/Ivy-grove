import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SchoolYearService,
  type CreateSchoolYear,
} from "@/services/schoolYear.service";
import type { SchoolYear } from "@/services/schoolYear.service";

// Query keys for caching
export const SCHOOL_YEARS_KEY = {
  all: ["school-year"] as const,
  detail: (id: string) => ["school-year", id] as const,
};

export function useCreateSchoolYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      schoolYear: CreateSchoolYear
    ): Promise<CreateSchoolYear> => {
      return SchoolYearService.createSchoolYear(
        schoolYear.start_date,
        schoolYear.end_date
      );
    },
    onSuccess: () => {
      // Invalidate all parent-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: SCHOOL_YEARS_KEY.all });
    },
    onError: (error) => {
      console.error("Failed to create school year:", error);
    },
  });
}

export function useFetchSchoolYears() {
  return useQuery<SchoolYear[]>({
    queryKey: SCHOOL_YEARS_KEY.all,
    queryFn: SchoolYearService.fetchSchoolYears,
  });
}
