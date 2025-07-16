import { supabase } from "@/lib/supabase";
import { formatDateForSupabase } from "@/lib/utils";

export const attendStudent = async (class_student_id: string | undefined, selectedDate?: Date) => {
  if (!class_student_id) {
    throw new Error("Class student ID is required");
  }

  const attendanceDate = selectedDate || new Date();
  const currentTime = new Date();

  const { error } = await supabase
    .from("attendance")
    .insert({
      date: formatDateForSupabase(attendanceDate),
      time_in: currentTime.toTimeString().split(" ")[0] ?? null,
      class_attendance_id: class_student_id,
    })
    .eq("id", class_student_id);

  if (error) {
    throw new Error(`Failed to mark attendance: ${error.message}`);
  }
};

export const timeOutStudent = async (class_student_id: string | undefined, selectedDate?: Date) => {
  if (!class_student_id) {
    throw new Error("Class student ID is required");
  }

  const attendanceDate = selectedDate || new Date();
  const currentTime = new Date();

  console.log(`Marking time out for student with ID: ${class_student_id}`);
  const { error } = await supabase
    .from("attendance")
    .update({
      time_out: currentTime.toTimeString().split(" ")[0] ?? null,
    })
    .eq("class_attendance_id", class_student_id)
    .eq("date", formatDateForSupabase(attendanceDate));

  if (error) {
    throw new Error(`Failed to mark time out: ${error.message}`);
  }
};
