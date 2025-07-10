import AddStudentToClass from "@/components/classes/AddStudentToClass";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassStudents = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <div className="flex items-center gap-2">
          <ArrowLeft onClick={handleBack} className="cursor-pointer" />
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        </div>
        <AddStudentToClass />
      </div>
    </div>
  );
};

export default ClassStudents;
