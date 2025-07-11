import type { Student } from "@/types/attendance";

const AttendanceStats = ({ students }: { students: Student[] }) => {
  const presentCount = students.filter((s) => s.attendance[0]?.time_in).length;
  //   const checkedOutCount = students.filter(
  //     (s) => s.attendance[0]?.time_in && s.attendance[0]?.time_out
  //   ).length;
  const absentCount = students.filter((s) => !s.attendance[0]?.time_in).length;
  const totalCount = students.length;

  return (
    <div className="flex items-center justify-around mb-2">
      <div className="text-sm">
        <span className="font-medium text-blue-600">
          {presentCount} Present
        </span>
      </div>
      <div className="text-sm">
        <span className="font-medium text-red-600">{absentCount} Absent</span>
      </div>
      <div className="text-sm">
        <span className="font-medium text-gray-900">{totalCount} Total</span>
      </div>
    </div>
  );
};

export default AttendanceStats;
