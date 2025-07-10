import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { CreateTeacher } from "@/components/features/teachers/CreateTeacher";
import { TeacherList } from "@/components/features/teachers/TeacherList";
import { ParentList } from "@/components/features/parents/ParentList";
import { CreateParent } from "@/components/features/parents/CreateParent";
import { CreateStudents } from "@/components/features/students/CreateStudents";
import { StudentList } from "@/components/features/students/StudentList";
import { SelectSchoolYear } from "@/components/features/students/SelectSchoolYear";
import { useFetchSchoolYears } from "@/hooks/useSchoolYear";

export default function Users() {
  const [tab, setTab] = useState<string>("teachers");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const { data: schoolYears, isLoading: isSchoolYearsLoading } =
    useFetchSchoolYears();

  return (
    <div className="no-scrollbar flex h-full flex-col gap-4 overflow-y-auto">
      <div>
        <Label className="text-2xl">Manage your school community.</Label>
      </div>
      {/* Tab list */}
      <div className="flex gap-2 flex-col sm:flex-row md:items-center">
        <Tabs onValueChange={(value) => setTab(value)} defaultValue={tab}>
          <TabsList className="w-full">
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Buttons */}
        {tab !== "students" && (
          <div className="self-end md:self-center">
            {tab === "teachers" && <CreateTeacher />}
            {tab === "parents" && <CreateParent />}
          </div>
        )}

        {tab === "students" && (
          <div className="flex justify-between px-2 gap-x-2 md:px-0">
            <SelectSchoolYear
              data={schoolYears}
              field={{
                value: selectedSchoolYear,
                onChange: setSelectedSchoolYear,
              }}
              isLoading={isSchoolYearsLoading}
            />
            <CreateStudents />
          </div>
        )}
      </div>
      {/* Main content */}
      <TeacherList isActive={tab === "teachers"} />
      <ParentList isActive={tab === "parents"} />
      <StudentList isActive={tab === "students"} schoolYearId={selectedSchoolYear} />
    </div>
  );
}
