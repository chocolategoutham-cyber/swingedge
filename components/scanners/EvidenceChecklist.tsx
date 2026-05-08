import type { EvidenceRule } from "@/lib/types";

export default function EvidenceChecklist({ rules }: { rules: EvidenceRule[] }) {
  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <div key={rule.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-white">{rule.label}</p>
            <span className={rule.passed ? "text-emerald-300" : "text-slate-400"}>
              {rule.passed ? "Pass" : "Watch"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400">{rule.description}</p>
        </div>
      ))}
    </div>
  );
}
