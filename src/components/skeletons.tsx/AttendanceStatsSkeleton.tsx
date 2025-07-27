import { Skeleton } from "../ui/skeleton";

const AttendanceStatsSkeleton = () => (
  <div className="flex items-center justify-around mb-2">
    <Skeleton className="h-4 w-16" />
    <Skeleton className="h-4 w-16" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export default AttendanceStatsSkeleton;
