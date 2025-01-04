import { Skeleton } from "@/components/ui/skeleton";

export const MapSkeleton = () => {
  return (
    <div className="w-full h-full relative">
      <Skeleton className="w-full h-full absolute inset-0" />
      <div className="absolute top-4 right-4">
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
};