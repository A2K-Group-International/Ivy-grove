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
   * Create new student
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
   * Update existing student
   */
  static async updateStudent(
    id: string,
    first_name: string,
    last_name: string,
    age: number,
    address: string
  ): Promise<StudentProfile> {
    const { data, error } = await supabase
      .from("students")
      .update({
        first_name,
        last_name,
        age,
        address,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete student
   */
  static async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) throw error;
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
      order: [{ column: "created_at", ascending: false }],
      ...(schoolYearId && {
        filters: {
          eq: { column: "school_year_id" as const, value: schoolYearId },
        },
      }),
    });
  }
}

/**
 * Fetches students in a given school year who are NOT already in the specified class.
 * @param schoolYearId - The ID of the school year
 * @param classId - The ID of the class to exclude students from
 * @returns Promise<StudentProfile[]> - Array of unassigned students
 * @throws Error if required parameters are missing or database operation fails
 */
export const fetchUnassignedStudents = async (
  schoolYearId: string,
  classId: string
): Promise<StudentProfile[]> => {
  if (!schoolYearId || !classId) {
    throw new Error("schoolYearId and classId are required");
  }

  try {
    // Step 1: Get student IDs already assigned to the class
    const { data: assigned, error: assignedError } = await supabase
      .from("class_students")
      .select("student_id")
      .eq("class_id", classId);

    if (assignedError) {
      throw new Error(
        `Failed to fetch assigned students: ${assignedError.message}`
      );
    }

    const assignedIds = assigned?.map((s) => s.student_id) ?? [];

    // Step 2: Fetch students in the school year who are not assigned
    let query = supabase
      .from("students")
      .select("*")
      .eq("school_year_id", schoolYearId)
      .order("created_at", { ascending: true });

    // Use correct Supabase syntax - pass array directly, not string
    if (assignedIds.length > 0) {
      query = query.not("id", "in", `(${assignedIds.join(",")})`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch unassigned students: ${error.message}`);
    }

    return data ?? [];
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Unexpected error in fetchUnassignedStudents: ${String(error)}`
    );
  }
};

export const fetchStudentsBySchoolYear = async () => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("school_years")
    .select("id,students(*,attendance(*))")
    .gte("end_date", today)
    .lte("start_date", today);

  if (error) {
    throw new Error(`Failed to fetch students: ${error.message}`);
  }

  return data;
};
