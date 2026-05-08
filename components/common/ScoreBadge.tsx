import { cn } from "@/lib/utils/format";

export default function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-12 justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
        score >= 80 && "bg-emerald-500/15 text-emerald-200",
        score >= 65 && score < 80 && "bg-blue-500/15 text-blue-200",
        score >= 50 && score < 65 && "bg-amber-500/15 text-amber-200",
        score < 50 && "bg-slate-500/15 text-slate-200"
      )}
    >
      {score}
    </span>
  );
}
