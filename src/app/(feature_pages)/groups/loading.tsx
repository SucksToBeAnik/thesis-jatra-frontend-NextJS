import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-[1000px] mx-auto h-[700px] space-y-4 my-12">
      <Skeleton className="h-16 w-full" />
      <div className="w-full h-[600px] flex space-x-4 ">
        <Skeleton className="h-full w-3/4" />
        <Skeleton className="h-full w-1/4" />
      </div>
    </div>
  );
}
