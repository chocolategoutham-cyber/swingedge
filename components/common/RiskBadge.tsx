import { cn } from "@/lib/utils/format";

export default function RiskBadge({ tier }: { tier: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        tier === "Low" && "bg-emerald-500/15 text-emerald-200",
        tier === "Moderate" && "bg-amber-500/15 text-amber-200",
        tier === "High" && "bg-orange-500/15 text-orange-200",
        tier === "Severe" && "bg-red-500/15 text-red-200"
      )}
    >
      {tier}
    </span>
  );
}
