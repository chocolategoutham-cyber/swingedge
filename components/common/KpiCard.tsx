import { cn } from "@/lib/utils/format";

export default function KpiCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "positive" | "warning" | "risk";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 backdrop-blur-sm",
        tone === "positive" && "border-emerald-500/30 bg-emerald-500/10",
        tone === "warning" && "border-amber-500/30 bg-amber-500/10",
        tone === "risk" && "border-red-500/30 bg-red-500/10",
        tone === "default" && "border-white/10 bg-white/5"
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-400">{hint}</p> : null}
    </div>
  );
}
