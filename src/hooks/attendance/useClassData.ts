import { useQuery } from "@tanstack/react-query";
import { fetchClassBySchoolYear } from "@/services/class.service";

export const useClassData = () => {
  return useQuery({
    queryKey: ["classesNow"],
    queryFn: fetchClassBySchoolYear,
  });
};
