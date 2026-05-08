import type { NiftyContext } from "@/lib/types";

export default function OpenInterestTable({ zones }: { zones: NiftyContext["supportResistanceZones"] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-white/10 bg-white/5">
          <tr>
            {["Strike", "Call OI", "Put OI", "Context", "Label"].map((label) => (
              <th key={label} className="px-4 py-3 text-left font-medium text-slate-300">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={`${zone.strike}-${zone.label}`} className="border-b border-white/5">
              <td className="px-4 py-3 text-white">{zone.strike}</td>
              <td className="px-4 py-3 text-slate-200">{zone.callOi.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3 text-slate-200">{zone.putOi.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3 text-slate-300">{zone.context}</td>
              <td className="px-4 py-3 text-slate-200">{zone.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
