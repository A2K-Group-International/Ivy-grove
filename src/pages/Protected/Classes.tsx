import {
  Card,
  //   CardContent,
  //   CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAllClasses } from "@/services/class.service";
import { useQuery } from "@tanstack/react-query";

type SchoolYearIdProp = {
  schoolYearId: string;
};

const Classses = ({ schoolYearId }: SchoolYearIdProp) => {
  const {
    data: classes,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["classes", schoolYearId],
    queryFn: () => fetchAllClasses(schoolYearId),
  });

  if (isError) {
    console.error("Error fetching classes:", error);
    return <p className="text-red-500">Failed to load classes.</p>;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="w-full cursor-pointer">
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
                {/* <CardDescription>
                  Created on{" "}
                  {new Date(cls.attendance_date).toLocaleDateString()}
                </CardDescription> */}
              </CardHeader>
              {/* <CardContent>
                <p>More details here if needed</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Class ID: {cls.id}
                </p>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No classes found.</p>
      )}
    </>
  );
};

export default Classses;
