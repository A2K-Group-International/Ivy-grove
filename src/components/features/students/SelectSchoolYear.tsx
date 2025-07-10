import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SchoolYear } from "@/services/schoolYear.service";
import { format } from "date-fns";
import { CalendarDays, Loader } from "lucide-react";

type SelectSchoolYearProps = {
  data?: SchoolYear[] | undefined;
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  isLoading: boolean;
};

export function SelectSchoolYear({
  data = [],
  field,
  isLoading,
}: SelectSchoolYearProps) {
  // Format school year using date-fns
  const formatSchoolYear = (startDate: string, endDate: string) => {
    const startYear = format(new Date(startDate), "yyyy");
    const endYear = format(new Date(endDate), "yyyy");
    return `${startYear} - ${endYear}`;
  };
  // Find the id of the school year base on field id
  const selectedSchoolYear = data.find((sy) => sy.id === field.value);
  //Display the formatted date
  const selectedDisplayValue = selectedSchoolYear
    ? formatSchoolYear(
        selectedSchoolYear.start_date,
        selectedSchoolYear.end_date
      )
    : undefined;

  return (
    <div className="relative">
      <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="pl-10 w-full">
          <SelectValue placeholder="School Year">
            {selectedDisplayValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            data?.map((schoolYear) => (
              <SelectItem key={schoolYear.id} value={schoolYear.id}>
                {formatSchoolYear(schoolYear.start_date, schoolYear.end_date)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
