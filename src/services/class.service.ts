import { supabase } from "@/lib/supabase";
import type { StudentProfile } from "@/services/students.service";

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
  const { error } = await supabase.from("class_students").insert(
    studentIds.map((studentId) => ({
      class_id: classId,
      student_id: studentId,
    }))
  );
  if (error) {
    throw new Error(`Failed to add students to class: ${error.message}`);
  }
};

export const removeStudentToClass = async ({
  studentId,
}: {
  studentId: string;
}) => {
  if (!studentId) {
    throw new Error("student ID is required");
  }
  const { error } = await supabase
    .from("class_students")
    .delete()
    .eq("student_id", studentId);

  if (error) {
    throw new Error(`Failed to remove student to class: ${error.message}`);
  }
};

export const fetchAllClasses = async (schoolYearId: string | undefined) => {
  if (!schoolYearId) {
    throw new Error("School year ID is required");
  }
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("school_year_id", schoolYearId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }

  return data;
};

export const fetchClassBySchoolYear = async () => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("school_years")
    .select("*, classes(*)")
    .gte("end_date", now)
    .lte("start_date", now)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to fetch classes by school year ID: ${error.message}`
    );
  }
  return data?.classes ?? [];
};

export const fetchStudentsPerClass = async (
  classId: string
): Promise<StudentProfile[]> => {
  if (!classId) {
    throw new Error("Class ID is required");
  }
  const { data, error } = await supabase
    .from("class_students")
    .select(
      "id, class_id, student_id(id, first_name, last_name, age,address , school_year_id)"
    )
    .eq("class_id", classId)
    .order("class_id", { ascending: true });

  if (error) {
    throw error;
  }

  return (
    data?.map((item) => ({
      id: item.student_id.id,
      first_name: item.student_id.first_name,
      last_name: item.student_id.last_name,
      age: item.student_id.age,
      address: item.student_id.address,
      school_year_id: item.student_id.school_year_id,
    })) ?? []
  );
};

export const fetchStudentsByClassWithStatus = async (
  classId: string | null,
  date: string
) => {
  if (!classId) {
    throw new Error("Class ID is required");
  }

  const { data, error } = await supabase
    .from("class_students")
    .select(
      "*, attendance(id, time_in, time_out), students(id, first_name, last_name, parent_id(*))"
    )
    .eq("class_id", classId)
    .eq("attendance.date", date);

  if (error) {
    throw new Error(
      `Failed to fetch students by class status: ${error.message}`
    );
  }

  return data;
};
