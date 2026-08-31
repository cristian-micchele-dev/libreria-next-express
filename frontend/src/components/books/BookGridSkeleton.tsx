import { BookCardSkeleton } from "./BookCardSkeleton";

interface BookGridSkeletonProps {
  count?: number;
}

export function BookGridSkeleton({ count = 10 }: BookGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
