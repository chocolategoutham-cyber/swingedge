export default function NiftySignalGauge({ score, label }: { score: number; label: string }) {
  const clamped = Math.max(-15, Math.min(15, score));
  const percent = ((clamped + 15) / 30) * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-400">Current signal</p>
      <p className="mt-2 text-2xl font-semibold text-white">{label}</p>
      <div className="mt-4 h-3 rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-300">Score: {score} / 15</p>
    </div>
  );
}
