import { supabase } from "@/lib/supabase";

export interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  school_year_id: string;
  parent_id: string | null;
}

export class StudentService {
  /**
   * Create new user school year
   */
  static async createStudent(
    first_name: string,
    last_name: string,
    age: number,
    school_year_id: string,
    parent_id: string | null
  ): Promise<StudentProfile> {
    const { data, error } = await supabase
      .from("students")
      .insert({
        first_name,
        last_name,
        age,
        school_year_id,
        parent_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
