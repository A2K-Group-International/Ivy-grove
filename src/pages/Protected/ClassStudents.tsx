import AddStudentToClass from "@/components/classes/AddStudentToClass";
import { StudentCard } from "@/components/features/students/StudentList";
import Loading from "@/components/Loading";
import { fetchStudentsPerClass } from "@/services/class.service";
import type { StudentProfile } from "@/services/students.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ClassStudents = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const handleBack = () => {
    navigate(-1);
  };

  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students-per-class", classId],
    queryFn: () => fetchStudentsPerClass(classId as string),
    enabled: !!classId,
  });

  if (isError) {
    return <div>Error loading students</div>;
  }

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeft onClick={handleBack} className="cursor-pointer" />
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        </div>
        <AddStudentToClass />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-h-dvh">
        {students?.map((student: StudentProfile) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default ClassStudents;
