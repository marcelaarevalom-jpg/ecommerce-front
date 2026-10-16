export default function Loading() {
  return (
    <div>
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-9 w-full animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
