import { supabase } from "@/lib/supabase";
import { paginate } from "@/utils/paginate";
import type { PaginateResult } from "@/types/utils";

export interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  school_year_id: string;
  address: string;
}

export class StudentService {
  /**
   * Create new user school year
   */
  static async createStudent(
    first_name: string,
    last_name: string,
    age: number,
    address: string,
    school_year_id: string
  ): Promise<StudentProfile> {
    const { data, error } = await supabase
      .from("students")
      .insert({
        first_name,
        last_name,
        age,
        address,
        school_year_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetch students
   */
  static async fetchStudents(
    page: number = 1,
    pageSize: number = 10,
    schoolYearId?: string | undefined
  ): Promise<PaginateResult<StudentProfile>> {
    return paginate<"students", StudentProfile>({
      key: "students",
      page,
      pageSize,
      order: [{ column: "created_at", ascending: true }],
      ...(schoolYearId && {
        filters: {
          eq: { column: "school_year_id" as const, value: schoolYearId },
        },
      }),
    });
  }
}

export const fetchStudentsNoPaginate = async (
  schoolYearId?: string | undefined
): Promise<StudentProfile[]> => {
  if (!schoolYearId) {
    throw new Error("School year ID is required");
  }
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("school_year_id", schoolYearId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as StudentProfile[];
};
