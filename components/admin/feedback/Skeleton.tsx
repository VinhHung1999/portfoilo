"use client";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className || ""}`}
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    />
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <SkeletonPulse className="h-4 w-24 mb-1.5" />
          <SkeletonPulse className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-lg border"
          style={{ borderColor: "var(--border)" }}
        >
          <SkeletonPulse className="h-5 w-48 mb-2" />
          <SkeletonPulse className="h-4 w-64 mb-2" />
          <SkeletonPulse className="h-3 w-40" />
        </div>
      ))}
    </div>
  );
}
