/**
 * Reusable skeleton loading components
 * Sprint 3: Loading Animations - Task #4
 */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--bg-tertiary)" }}>
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full mb-6" />

      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mb-4" />

      {/* Description skeleton */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mb-4" />

      {/* Tags skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-18" />
      </div>
    </div>
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--bg-tertiary)" }}>
      {/* Header skeleton */}
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />

      {/* Content skeleton */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/5 mb-4" />

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-18" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function SkillItemSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl" style={{ backgroundColor: "var(--bg-tertiary)" }}>
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
