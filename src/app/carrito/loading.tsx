export default function Loading() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <div className="card space-y-4">
        <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded bg-slate-200" />)}
      </div>
      <div className="card h-40 animate-pulse bg-slate-100" />
    </div>
  );
}
