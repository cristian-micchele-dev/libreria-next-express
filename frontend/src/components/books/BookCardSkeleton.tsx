interface BookCardSkeletonProps {
  index?: number;
}

export function BookCardSkeleton({ index = 0 }: BookCardSkeletonProps) {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover skeleton */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-secondary">
        <div className="skeleton-shimmer absolute inset-0" />
        {/* Fake spine line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-border/30" />
      </div>

      {/* Text skeletons */}
      <div className="mt-3 space-y-2">
        <div className="h-4 w-4/5 rounded bg-secondary overflow-hidden relative">
          <div className="skeleton-shimmer absolute inset-0" />
        </div>
        <div className="h-3 w-3/5 rounded bg-secondary overflow-hidden relative">
          <div className="skeleton-shimmer absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
