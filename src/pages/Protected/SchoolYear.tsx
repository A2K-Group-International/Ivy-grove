import { CreateSchoolYear } from "@/components/features/schoolyear/CreateSchoolYear";
import { useFetchSchoolYears } from "@/hooks/useSchoolYear";
import { SelectSchoolYear } from "@/components/features/students/SelectSchoolYear";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GraduationCap, Loader } from "lucide-react";
import { formatSchoolYear } from "@/utils/formatSchoolYear";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Classes from "@/pages/Protected/Classes";
import AddClassForm from "@/components/classes/AddClassForm";
import StudentsTable from "@/components/features/schoolyear/StudentsTable";

export default function SchoolYear() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schoolYearId, setSchoolYearId] = useState<string>("");
  const [tab, setTab] = useState("students");

  // Fetch School Years
  const {
    data: schoolYears,
    isLoading: isSchoolYearsLoading,
    error: errorLoadingSchoolYears,
  } = useFetchSchoolYears();

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
            {tab === "classes" && <AddClassForm schoolYearId={schoolYearId} />}
          </div>
          <TabsContent value="students">
            <StudentsTable schoolYearId={schoolYearId} />
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
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 ">
      <div className="w-full flex flex-col sm:flex-row md:justify-between">
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
        <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-y-2 gap-x-3 justify-between mt-3 md:mt-0 md:justify-center lg:py-3">
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
          <CreateSchoolYear className="" />
        </div>
      </div>
    </div>
  );
}
