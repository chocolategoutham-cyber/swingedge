import type { SectorSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils/format";

export default function SectorHeatmap({ rows }: { rows: SectorSnapshot[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
      <table className="min-w-[760px] w-full text-sm">
        <thead className="border-b border-white/10 bg-white/5">
          <tr>
            {["Sector", "1W", "1M", "3M", "RS Score", "Trend", "Breadth"].map((label) => (
              <th key={label} className="px-4 py-3 text-left font-medium text-slate-300">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sector} className="border-b border-white/5">
              <td className="px-4 py-3 text-white">{row.sector}</td>
              <td className={cn("px-4 py-3", row.return1w >= 0 ? "text-emerald-300" : "text-red-300")}>{row.return1w}%</td>
              <td className={cn("px-4 py-3", row.return1m >= 0 ? "text-emerald-300" : "text-red-300")}>{row.return1m}%</td>
              <td className={cn("px-4 py-3", row.return3m >= 0 ? "text-emerald-300" : "text-red-300")}>{row.return3m}%</td>
              <td className="px-4 py-3 text-slate-200">{row.rsScore}</td>
              <td className="px-4 py-3 text-slate-200">{row.trendState}</td>
              <td className="px-4 py-3 text-slate-200">{row.breadthScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
