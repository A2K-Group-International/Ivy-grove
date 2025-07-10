import { supabase } from "@/lib/supabase";

export interface SchoolYear {
  id: string;
  start_date: string;
  end_date: string;
}

export interface CreateSchoolYear {
  start_date: string;
  end_date: string;
}

export class SchoolYearService {
  /**
   * Create new user school year
   */
  static async createSchoolYear(
    start_date: string,
    end_date: string
  ): Promise<CreateSchoolYear> {
    const { data, error } = await supabase
      .from("school_years")
      .insert({
        start_date,
        end_date,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create new user profile
   */
  static async fetchSchoolYears(): Promise<SchoolYear[]> {
    const { data, error } = await supabase
      .from("school_years")
      .select("id, start_date, end_date");

    if (error) throw error;
    return data;
  }
}
