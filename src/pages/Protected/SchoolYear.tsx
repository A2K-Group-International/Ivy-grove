import { CreateSchoolYear } from "@/components/features/schoolyear/CreateSchoolYear";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchSchoolYears } from "@/hooks/useSchoolYear";
import { formatSchoolYear } from "@/utils/formatSchoolYear";
import { useNavigate } from "react-router-dom";

export default function SchoolYear() {
  const { data, isError, isLoading, error } = useFetchSchoolYears();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (id: string) => {
    navigate(`/school-year/${id}/classes`);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-2xl">School Year Management</Label>
        <CreateSchoolYear />
      </div>
      <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-x-2">
        {data?.map((schoolYear) => (
          <Card
            onClick={() => handleClick(schoolYear.id)}
            key={schoolYear.id}
            className="mb-4"
          >
            <CardHeader>
              <CardTitle>
                {`Academic Year: ${formatSchoolYear(
                  schoolYear.start_date,
                  schoolYear.end_date
                )}`}
              </CardTitle>
              <CardDescription className="sr-only">
                School Year Description
              </CardDescription>
            </CardHeader>
            <CardContent className="sr-only">School Year Content</CardContent>
            <CardFooter className="sr-only">School Year Footer</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
