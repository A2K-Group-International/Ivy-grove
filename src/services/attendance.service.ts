import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const attendStudent = async (
  class_student_id: string | undefined,
  selectedDate?: Date
) => {
  if (!class_student_id) {
    throw new Error("Class student ID is required");
  }

  const formatDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");
  const currentTime = new Date();

  const { error } = await supabase
    .from("attendance")
    .insert({
      date: formatDate,
      time_in: currentTime.toTimeString().split(" ")[0] ?? null,
      class_attendance_id: class_student_id,
    })
    .eq("id", class_student_id);

  if (error) {
    throw new Error(`Failed to mark attendance: ${error.message}`);
  }
};

export const timeOutStudent = async (
  class_student_id: string | undefined,
  selectedDate?: Date
) => {
  if (!class_student_id) {
    throw new Error("Class student ID is required");
  }

  const formatDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");
  const currentTime = new Date();

  const { error } = await supabase
    .from("attendance")
    .update({
      time_out: currentTime.toTimeString().split(" ")[0] ?? null,
    })
    .eq("class_attendance_id", class_student_id)
    .eq("date", formatDate);

  if (error) {
    throw new Error(`Failed to mark time out: ${error.message}`);
  }
};

export const updateAttendanceTime = async (
  attendanceId: string,
  timeType: "time_in" | "time_out",
  newTime: string
) => {
  if (!attendanceId) {
    throw new Error("Attendance ID is required");
  }

  if (!newTime) {
    throw new Error("Time is required");
  }

  const { error } = await supabase
    .from("attendance")
    .update({
      [timeType]: newTime,
    })
    .eq("id", attendanceId);

  if (error) {
    throw new Error(`Failed to update ${timeType}: ${error.message}`);
  }
};
