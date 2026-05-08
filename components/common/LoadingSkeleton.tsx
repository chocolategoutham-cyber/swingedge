export default function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-xl bg-white/5"
        />
      ))}
    </div>
  );
}
