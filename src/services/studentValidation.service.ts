import { supabase } from "@/lib/supabase";

/**
 * Check if a student with the same first name, last name already exists in the school year
 */
export const checkStudentExists = async (
  firstName: string,
  lastName: string,
  schoolYearId: string,
  excludeStudentId?: string
): Promise<boolean> => {
  let query = supabase
    .from("students")
    .select("id")
    .eq("first_name", firstName.trim())
    .eq("last_name", lastName.trim())
    .eq("school_year_id", schoolYearId);

  // If updating a student, exclude their current record
  if (excludeStudentId) {
    query = query.neq("id", excludeStudentId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to check student existence: ${error.message}`);
  }

  return (data?.length ?? 0) > 0;
};

/**
 * Enhanced create student function with uniqueness validation
 */
export const createStudentWithValidation = async (
  firstName: string,
  lastName: string,
  date_of_birth: string,
  address: string,
  schoolYearId: string
) => {
  // Check if student already exists
  const exists = await checkStudentExists(firstName, lastName, schoolYearId);

  if (exists) {
    throw new Error(
      `A student named "${firstName} ${lastName}" already exists in this school year.`
    );
  }

  // If validation passes, create the student
  const { data, error } = await supabase
    .from("students")
    .insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth,
      address: address.trim(),
      school_year_id: schoolYearId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create student: ${error.message}`);
  }

  return data;
};
