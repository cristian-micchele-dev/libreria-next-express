export function BookDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start animate-fade-in">
      {/* Cover skeleton */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative aspect-[2/3] w-full max-w-[380px] overflow-hidden rounded-sm bg-secondary">
          <div className="skeleton-shimmer absolute inset-0" />
          {/* Decorative spine lines */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/20" />
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/10" />
        </div>
      </div>

      {/* Info skeleton */}
      <div className="flex flex-col gap-6">
        {/* Category badges */}
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-6 w-16 rounded-full bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="h-10 w-4/5 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-10 w-3/5 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          {/* Editorial rule */}
          <div className="h-[3px] w-[60px] rounded bg-secondary overflow-hidden relative mt-3">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          {/* Author */}
          <div className="h-5 w-48 rounded bg-secondary overflow-hidden relative mt-2">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-4 pb-2 border-b border-border/30">
          <div className="h-10 w-32 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-5 w-24 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>

        {/* Buttons */}
        <div className="hidden lg:flex gap-3">
          <div className="h-12 w-52 rounded-md bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-12 w-36 rounded-md bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-border/20 p-6 space-y-3">
          <div className="h-3 w-20 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-4 w-full rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-4 w-full rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-4 w-4/5 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="h-4 w-3/5 rounded bg-secondary overflow-hidden relative">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/20 p-4 space-y-2">
              <div className="h-4 w-4 rounded bg-secondary overflow-hidden relative">
                <div className="skeleton-shimmer absolute inset-0" />
              </div>
              <div className="h-3 w-14 rounded bg-secondary overflow-hidden relative">
                <div className="skeleton-shimmer absolute inset-0" />
              </div>
              <div className="h-6 w-12 rounded bg-secondary overflow-hidden relative">
                <div className="skeleton-shimmer absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
