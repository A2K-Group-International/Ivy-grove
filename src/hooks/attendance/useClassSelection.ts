import { useSearchParams } from "react-router-dom";

export const useClassSelection = () => {
  const [params, setSearchParams] = useSearchParams();
  const classId = params.get("classId") || "";

  const setClassId = (id: string) => {
    if (id) {
      setSearchParams({ classId: id });
    } else {
      setSearchParams({});
    }
  };

  return {
    classId,
    setClassId,
  };
};
