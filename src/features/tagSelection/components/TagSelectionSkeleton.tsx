export function TagSelectionSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="h-12 w-full animate-pulse rounded bg-white" />
    </section>
  );
}
