"use client";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square flex items-center justify-center p-6 sm:p-8">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.04]" />
      </div>

      {/* Info skeleton */}
      <div className="p-4 pt-0 space-y-3">
        <div>
          <div className="h-4 w-3/4 rounded-full bg-white/[0.06]" />
          <div className="h-3 w-1/2 rounded-full bg-white/[0.04] mt-2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
          <div className="h-4 w-20 rounded-full bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}
