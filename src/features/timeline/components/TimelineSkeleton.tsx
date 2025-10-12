function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex justify-between">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-8 w-24 rounded bg-slate-200" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="h-3 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-4 h-3 w-full rounded bg-slate-200" />
      <div className="mt-3 h-3 w-3/4 rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-5/6 rounded bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-5/6 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-10 w-1/3 animate-pulse rounded bg-slate-200" />
      <SkeletonCard />
      <SkeletonCard />
    </section>
  );
}
