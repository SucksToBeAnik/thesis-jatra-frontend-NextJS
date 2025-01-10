import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-screen h-[700px] flex space-x-4 my-12 mx-4">
      <Skeleton className="h-full w-2/4" />
      <Skeleton className="h-full w-2/4" />
    </div>
  );
}
