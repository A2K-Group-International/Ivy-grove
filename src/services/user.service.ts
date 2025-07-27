import { supabase } from "@/lib/supabase";
import { paginate } from "@/utils/paginate";
import type { PaginateResult } from "@/types/utils";

export type UserRole = "admin" | "teacher" | "parent";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  contact: string;
  address: string;
}

export interface FetchParentNoPagination {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface StudentWithParent {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  address: string;
  school_year_id: string;
}

export interface ParentWithStudents extends UserProfile {
  students: StudentWithParent[];
}

export class UserService {
  /**
   * Fetch parents
   */
  static async fetchParents(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginateResult<UserProfile>> {
    return paginate<"users", UserProfile>({
      key: "users",
      page,
      pageSize,
      filters: {
        eq: { column: "role", value: "parent" },
      },
      order: [{ column: "first_name", ascending: true }],
    });
  }

  /**
   * Fetch parents with their students
   */
  static async fetchParentsWithStudents(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginateResult<ParentWithStudents>> {
    const parentsResult = await paginate<"users", UserProfile>({
      key: "users",
      page,
      pageSize,
      filters: {
        eq: { column: "role", value: "parent" },
      },
      order: [{ column: "first_name", ascending: true }],
    });

    const parentsWithStudents: ParentWithStudents[] = await Promise.all(
      parentsResult.items.map(async (parent) => {
        const students = await UserService.getStudentsByParentId(parent.id);
        return {
          ...parent,
          students,
        };
      })
    );

    return {
      ...parentsResult,
      items: parentsWithStudents,
    };
  }

  /**
   * Fetch teachers
   */
  static async fetchTeachers(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginateResult<UserProfile>> {
    return paginate<"users", UserProfile>({
      key: "users",
      page,
      pageSize,
      filters: {
        eq: { column: "role", value: "teacher" },
      },
      order: [{ column: "first_name", ascending: true }],
    });
  }

  /**
   * Fetch parents without pagination
   */
  static async fetchParentsNoPagination(): Promise<FetchParentNoPagination[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email")
      .eq("role", "parent")
      .order("first_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get students by parent ID
   */
  static async getStudentsByParentId(
    parentId: string
  ): Promise<StudentWithParent[]> {
    const { data, error } = await supabase
      .from("students")
      .select("id, first_name, last_name, age, address, school_year_id")
      .eq("parent_id", parentId)
      .order("first_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update parent information
   */
  static async updateParent(
    id: string,
    first_name: string,
    last_name: string,
    contact: string,
    address: string
  ): Promise<UserProfile> {
    // update the user
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name,
        last_name,
        contact,
        address: address,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      throw new Error(`Failed to update parent: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from update operation");
    }

    return data;
  }

  /**
   * Delete parent
   */
  static async deleteParent(id: string): Promise<void> {
    // First, unlink all students from this parent
    await supabase
      .from("students")
      .update({ parent_id: null })
      .eq("parent_id", id);

    // Then delete the parent
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
  }

  /**
   * Link student to parent
   */
  static async linkStudentToParent(
    studentId: string,
    parentId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("students")
      .update({ parent_id: parentId })
      .eq("id", studentId);

    if (error) throw error;
  }

  /**
   * Unlink student from parent
   */
  static async unlinkStudentFromParent(studentId: string): Promise<void> {
    const { error } = await supabase
      .from("students")
      .update({ parent_id: null })
      .eq("id", studentId);

    if (error) throw error;
  }

  /**
   * Get unlinked students (students without parent)
   */
  static async getUnlinkedStudents(): Promise<StudentWithParent[]> {
    const { data, error } = await supabase
      .from("students")
      .select("id, first_name, last_name, age, address, school_year_id")
      .is("parent_id", null)
      .order("first_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update teacher information
   */
  static async updateTeacher(
    id: string,
    first_name: string,
    last_name: string,
    contact: string,
    address: string
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name,
        last_name,
        contact,
        address,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      throw new Error(`Failed to update teacher: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from update operation");
    }

    return data;
  }

  /**
   * Delete teacher
   */
  static async deleteTeacher(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
  }
}
