import type { DailyCandle } from "@/lib/types";

export default function CandlestickChart({
  candles,
  pivot,
  support,
  target1,
  target2,
}: {
  candles: DailyCandle[];
  pivot?: number;
  support?: number;
  target1?: number;
  target2?: number;
}) {
  const recent = candles.slice(-24);
  const max = Math.max(...recent.map((candle) => candle.high), pivot ?? 0, target1 ?? 0, target2 ?? 0);
  const min = Math.min(...recent.map((candle) => candle.low), support ?? recent[0]?.low ?? 0);

  const y = (value: number) => 210 - ((value - min) / Math.max(max - min, 1)) * 180;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <svg viewBox="0 0 520 220" className="w-full">
        <rect x="0" y="0" width="520" height="220" rx="16" fill="#07101d" />
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="16" x2="504" y1={40 + line * 40} y2={40 + line * 40} stroke="rgba(148,163,184,0.12)" />
        ))}
        {recent.map((candle, index) => {
          const x = 24 + index * 20;
          const bullish = candle.close >= candle.open;
          return (
            <g key={candle.date}>
              <line x1={x + 6} x2={x + 6} y1={y(candle.high)} y2={y(candle.low)} stroke={bullish ? "#34d399" : "#f87171"} />
              <rect
                x={x}
                y={y(Math.max(candle.open, candle.close))}
                width="12"
                height={Math.max(4, Math.abs(y(candle.open) - y(candle.close)))}
                fill={bullish ? "#34d399" : "#f87171"}
                rx="3"
              />
            </g>
          );
        })}
        {pivot ? <line x1="16" x2="504" y1={y(pivot)} y2={y(pivot)} stroke="#38bdf8" strokeDasharray="6 4" /> : null}
        {support ? <line x1="16" x2="504" y1={y(support)} y2={y(support)} stroke="#f59e0b" strokeDasharray="5 5" /> : null}
        {target1 ? <line x1="16" x2="504" y1={y(target1)} y2={y(target1)} stroke="#10b981" strokeDasharray="3 4" /> : null}
        {target2 ? <line x1="16" x2="504" y1={y(target2)} y2={y(target2)} stroke="#22c55e" strokeDasharray="3 4" /> : null}
      </svg>
    </div>
  );
}
