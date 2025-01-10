import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-[calc(100vw - 100px)] w-screen flex flex-col space-y-4 my-12">
      <Skeleton className="h-16 w-full" />
      <div className="flex h-[600px] space-x-4">
        <Skeleton className="h-full w-1/4" />
        <Skeleton className="h-full w-3/4" />
      </div>
    </div>
  );
}
