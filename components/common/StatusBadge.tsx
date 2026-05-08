import { cn } from "@/lib/utils/format";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        status === "Open" && "bg-blue-500/15 text-blue-200",
        status === "Target 2 Hit" && "bg-emerald-500/15 text-emerald-200",
        status === "Target 1 Hit" && "bg-teal-500/15 text-teal-200",
        status === "Partial Target" && "bg-violet-500/15 text-violet-200",
        status === "Stop/Reference Breach" && "bg-red-500/15 text-red-200",
        status === "Expired" && "bg-slate-500/15 text-slate-200",
        status === "Invalidated" && "bg-amber-500/15 text-amber-200"
      )}
    >
      {status}
    </span>
  );
}
