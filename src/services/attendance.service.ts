import { supabase } from "@/lib/supabase";

export const attendStudent = async (class_student_id: string | undefined) => {
  if (!class_student_id) {
    throw new Error("Class student ID is required");
  }

  const { error } = await supabase
    .from("attendance")
    .insert({
      date: new Date().toISOString(),
      time_in: new Date().toTimeString().split(" ")[0] ?? null,
      class_attendance_id: class_student_id,
    })
    .eq("id", class_student_id);

  if (error) {
    throw new Error(`Failed to mark attendance: ${error.message}`);
  }
};

export const timeOutStudent = async (class_student_id: string | undefined) => {
  if (!class_student_id) {
    throw new Error("Class student ID is required");
  }

  console.log(`Marking time out for student with ID: ${class_student_id}`);
  const { error } = await supabase
    .from("attendance")
    .update({
      time_out: new Date().toTimeString().split(" ")[0] ?? null,
    })
    .eq("class_attendance_id", class_student_id);

  if (error) {
    throw new Error(`Failed to mark time out: ${error.message}`);
  }
};
