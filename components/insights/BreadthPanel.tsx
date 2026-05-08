export default function BreadthPanel({
  advancers,
  decliners,
  unchanged,
  ratio,
  above20,
  above50,
  above200,
}: {
  advancers: number;
  decliners: number;
  unchanged: number;
  ratio: number;
  above20: number;
  above50: number;
  above200: number;
}) {
  const items = [
    ["Advancers", advancers],
    ["Decliners", decliners],
    ["Unchanged", unchanged],
    ["A/D ratio", ratio.toFixed(2)],
    ["Above 20DMA", `${above20}%`],
    ["Above 50DMA", `${above50}%`],
    ["Above 200DMA", `${above200}%`],
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
