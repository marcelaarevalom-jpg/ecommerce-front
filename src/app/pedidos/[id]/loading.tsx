export default function Loading() {
  return (
    <div className="card mx-auto max-w-2xl space-y-4">
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 animate-pulse rounded bg-slate-200" />)}
      <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
    </div>
  );
}
