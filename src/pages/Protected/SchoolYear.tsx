import { CreateSchoolYear } from "@/components/features/schoolyear/CreateSchoolYear";
import { useFetchSchoolYears } from "@/hooks/useSchoolYear";
import { SelectSchoolYear } from "@/components/features/students/SelectSchoolYear";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetStudents } from "@/hooks/useStudent";
import type { StudentProfile } from "@/services/students.service";
import { StudentCard } from "@/components/features/students/StudentList";
import { GraduationCap, Loader } from "lucide-react";
import { CreateStudents } from "@/components/features/students/CreateStudents";
import { formatSchoolYear } from "@/utils/formatSchoolYear";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Classes from "@/pages/Protected/Classes";
import AddClassForm from "@/components/classes/AddClassForm";

export default function SchoolYear() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schoolYearId, setSchoolYearId] = useState<string>("");
  const [tab, setTab] = useState("students");
  const pageSize = 10;

  // Fetch School Years
  const {
    data: schoolYears,
    isLoading: isSchoolYearsLoading,
    error: errorLoadingSchoolYears,
  } = useFetchSchoolYears();

  // Fetch students per school year
  const {
    data: students,
    isLoading: isStudentsLoading,
    error: errorLoadingStudents,
  } = useGetStudents(1, pageSize, schoolYearId);

  // Find the selected school year object
  const selectedSchoolYear = schoolYears?.find((sy) => sy.id === schoolYearId);

  // Initialize schoolYearId from URL or set first available
  useEffect(() => {
    const urlSchoolYearId = searchParams.get("id");

    if (urlSchoolYearId) {
      // If URL has a school year ID
      setSchoolYearId(urlSchoolYearId);
    } else if (schoolYears?.[0]?.id) {
      // If no URL param but school years are loaded, use first one
      const firstSchoolYearId = schoolYears[0].id;
      setSchoolYearId(firstSchoolYearId);
      setSearchParams({ id: firstSchoolYearId });
    }
  }, [schoolYears, searchParams, setSearchParams]);

  const handleSchoolYearChange = (value: string) => {
    setSchoolYearId(value);
    setSearchParams({ id: value });
  };

  if (errorLoadingSchoolYears) {
    return <div>Error: {errorLoadingSchoolYears.message}</div>;
  }

  if (errorLoadingStudents) {
    return <div>Error: {errorLoadingStudents.message}</div>;
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <SchoolYearHeader
        selectedSchoolYear={selectedSchoolYear}
        schoolYears={schoolYears}
        schoolYearId={schoolYearId}
        isSchoolYearsLoading={isSchoolYearsLoading}
        onSchoolYearChange={handleSchoolYearChange}
      />

      {/* Main Content */}
      {selectedSchoolYear && (
        <Tabs onValueChange={(value) => setTab(value)} defaultValue={tab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
            </TabsList>
            {tab === "students" && (
              <CreateStudents schoolYearId={schoolYearId} />
            )}
            {tab === "classes" && <AddClassForm schoolYearId={schoolYearId} />}
          </div>
          <TabsContent value="students">
            {isStudentsLoading ? (
              <div className="flex items-center justify-center h-dvh w-full">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-y-2">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-h-dvh">
                  {students?.items?.length ? (
                    students.items.map((student: StudentProfile) => (
                      <StudentCard key={student.id} student={student} />
                    ))
                  ) : (
                    <div>No students found</div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="classes">
            <Classes schoolYearId={schoolYearId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Data type for school year
type SchoolYearType = {
  id: string;
  start_date: string;
  end_date: string;
};

type SchoolYearHeaderProps = {
  selectedSchoolYear: SchoolYearType | undefined;
  schoolYears: SchoolYearType[] | undefined;
  schoolYearId: string;
  isSchoolYearsLoading: boolean;
  onSchoolYearChange: (value: string) => void;
};

function SchoolYearHeader({
  selectedSchoolYear,
  schoolYears,
  schoolYearId,
  isSchoolYearsLoading,
  onSchoolYearChange,
}: SchoolYearHeaderProps) {
  if (!selectedSchoolYear) {
    return (
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-school-700">
          No School Year Found
        </h1>
        <CreateSchoolYear />
      </div>
    );
  }

  //Display the formatted date
  const selectedDisplayValue = formatSchoolYear(
    selectedSchoolYear.start_date,
    selectedSchoolYear.end_date
  );

  // Display the formatted school year with start month and end month
  const schoolYearMonth = `${format(
    parseISO(selectedSchoolYear.start_date),
    "MMM dd, yyyy"
  )} - ${format(parseISO(selectedSchoolYear.end_date), "MMM dd, yyyy")}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="bg-school-100 p-3 rounded-lg">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-school-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-school-700">
              {`School Year ${selectedDisplayValue}`}
            </h1>
            <p className="text-sm sm:text-base text-school-700">
              {schoolYearMonth}
            </p>
          </div>
        </div>
        <div className="flex justify-between sm:flex-col gap-y-2">
          {isSchoolYearsLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <SelectSchoolYear
              data={schoolYears}
              field={{
                value: schoolYearId,
                onChange: onSchoolYearChange,
              }}
              isLoading={isSchoolYearsLoading}
            />
          )}
          <CreateSchoolYear />
        </div>
      </div>
    </div>
  );
}
