import { BookGridSkeleton } from "@/components/books/BookGridSkeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header skeleton */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-4 w-4 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-4 w-28 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>
        <div className="h-10 w-64 rounded bg-secondary overflow-hidden relative">
          <div className="skeleton-shimmer absolute inset-0" />
        </div>
        <div className="h-[3px] w-[60px] rounded bg-secondary overflow-hidden relative mt-3">
          <div className="skeleton-shimmer absolute inset-0" />
        </div>
      </div>

      <BookGridSkeleton />
    </div>
  );
}
