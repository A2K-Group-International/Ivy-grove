import { supabase } from "@/lib/supabase";

export const addClass = async ({
  schoolYearId,
  className,
}: {
  schoolYearId: string | undefined;
  className: string;
}) => {
  if (!schoolYearId) {
    throw new Error("School year ID is required");
  }
  const { error } = await supabase.from("classes").insert({
    school_year_id: schoolYearId,
    name: className,
  });
  if (error) {
    throw new Error(`Failed to add class: ${error.message}`);
  }
};

export const editClass = async ({
  classId,
  className,
}: {
  classId: string;
  className: string;
}) => {
  if (!classId) {
    throw new Error("Class ID is required");
  }
  const { error } = await supabase
    .from("classes")
    .update({ name: className })
    .eq("id", classId);

  if (error) {
    throw new Error(`Failed to edit class: ${error.message}`);
  }
};

export const deleteClass = async (classId: string) => {
  if (!classId) {
    throw new Error("Class ID is required");
  }
  const { error } = await supabase.from("classes").delete().eq("id", classId);
  if (error) {
    throw new Error(`Failed to delete class: ${error.message}`);
  }
};

export const addStudentToClass = async ({
  classId,
  studentIds,
}: {
  classId: string | undefined;
  studentIds: string[];
}) => {
  if (!classId || studentIds.length === 0) {
    throw new Error("Class ID and student IDs are required");
  }
  const { error } = await supabase.from("attendance_students").insert(
    studentIds.map((studentId) => ({
      class_id: classId,
      student_id: studentId,
    }))
  );
  if (error) {
    throw new Error(`Failed to add students to class: ${error.message}`);
  }
};

export const fetchAllClasses = async (schoolYearId: string | undefined) => {
  if (!schoolYearId) {
    throw new Error("School year ID is required");
  }
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("school_year_id", schoolYearId);

  if (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }

  return data;
};
