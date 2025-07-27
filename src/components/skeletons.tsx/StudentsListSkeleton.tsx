import { Skeleton } from "../ui/skeleton";

const StudentCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-lg border bg-white">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

const StudentsListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, index) => (
      <StudentCardSkeleton key={index} />
    ))}
  </div>
);

export default StudentsListSkeleton;
