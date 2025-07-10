import { format } from "date-fns";

export const formatSchoolYear = (startDate: string, endDate: string) => {
  const startYear = format(new Date(startDate), "yyyy");
  const endYear = format(new Date(endDate), "yyyy");
  return `${startYear} - ${endYear}`;
};
