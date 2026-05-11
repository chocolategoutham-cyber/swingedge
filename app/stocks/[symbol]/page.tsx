import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import KpiCard from "@/components/common/KpiCard";
import CandlestickChart from "@/components/charts/CandlestickChart";
import StockDetailTabs from "@/components/stocks/StockDetailTabs";
import EvidenceChecklist from "@/components/scanners/EvidenceChecklist";
import ScoreBadge from "@/components/common/ScoreBadge";
import RiskBadge from "@/components/common/RiskBadge";
import {
  getBreakdownScanner,
  getBreakoutScanner,
  getMomentumScanner,
  getPreBreakoutScanner,
  getStockDetail,
} from "@/lib/api";
import type { ProofRecord, ScannerSignal } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol} - Stock Research Detail`,
    description: `Scanner appearances, chart context, indicators, and proof history for ${symbol}.`,
  };
}

function signalPriority(signal: ScannerSignal) {
  if (signal.scannerType === "breakout") return 4;
  if (signal.scannerType === "pre-breakout") return 3;
  if (signal.scannerType === "momentum") return 2;
  return 1;
}

function formatCurrency(value?: number) {
  if (value == null || Number.isNaN(value)) return "NA";
  return `₹${value.toFixed(2)}`;
}

function formatPercent(value?: number) {
  if (value == null || Number.isNaN(value)) return "NA";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function appearanceLabel(signal: ScannerSignal) {
  if (signal.scannerType === "pre-breakout") return "Appeared in pre-breakout scanner";
  if (signal.scannerType === "breakout") return "Moved into breakout scanner";
  if (signal.scannerType === "momentum") return "Flagged as momentum leader";
  return "Flagged on bearish risk scanner";
}

function buildTimeline(signals: ScannerSignal[], latestPrice: number) {
  return [...signals]
    .sort((left, right) => {
      const dateDiff =
        new Date(left.signalDate).getTime() - new Date(right.signalDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return signalPriority(left) - signalPriority(right);
    })
    .map((signal) => ({
      id: signal.id,
      date: signal.signalDate,
      title: appearanceLabel(signal),
      setupType: signal.setupType,
      priceThen: signal.price,
      movePct: signal.price ? ((latestPrice - signal.price) / signal.price) * 100 : 0,
    }));
}

function metricNumber(value: ScannerSignal["metrics"][string]) {
  return typeof value === "number" ? value : null;
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  let detail;
  try {
    detail = await getStockDetail(symbol);
  } catch {
    notFound();
  }

  const [preBreakout, breakouts, breakdowns, momentum] = await Promise.all([
    getPreBreakoutScanner(),
    getBreakoutScanner(),
    getBreakdownScanner(),
    getMomentumScanner(),
  ]);

  const { stock, signals, proof, candles } = detail;
  const latest = candles[candles.length - 1];
  const latestSignal =
    [...signals].sort((left, right) => signalPriority(right) - signalPriority(left))[0] ?? null;

  const timeline = buildTimeline(signals, latest.close);
  const allRows = [
    ...preBreakout.rows,
    ...breakouts.rows,
    ...breakdowns.rows,
    ...momentum.rows,
  ];

  const related = allRows
    .filter(
      (row, index, rows) =>
        row.symbol !== symbol &&
        row.sector === stock.sector &&
        rows.findIndex((candidate) => candidate.symbol === row.symbol) === index
    )
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);

  const latestProof = [...proof].sort(
    (left, right) =>
      new Date(right.firstSeenDate).getTime() - new Date(left.firstSeenDate).getTime()
  )[0] as ProofRecord | undefined;

  return (
    <main>
      <PageHero
        eyebrow="Stock detail"
        title={symbol}
        subtitle={`${stock.companyName}. Review scanner status, chart levels, timeline transitions, proof history, and same-sector context in one place.`}
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>

      <section className="container pb-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl font-black text-white">{symbol}</h2>
              <p className="mt-1 text-sm text-slate-400">{stock.companyName}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Latest scanner signal, chart levels, evidence tags, and progression
                timeline for {symbol}. Research software only, not investment advice.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {stock.sector}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                  {stock.marketCapBucket}
                </span>
                {latestSignal ? (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                    {latestSignal.setupType}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="min-w-[240px] rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest status</p>
              <p className="mt-2 text-2xl font-black text-white">
                {latestSignal?.scannerType === "breakout"
                  ? "Breakout"
                  : latestSignal?.scannerType === "pre-breakout"
                    ? "Pre-Breakout"
                    : latestSignal?.scannerType === "momentum"
                      ? "Momentum"
                      : latestSignal?.scannerType === "breakdown"
                        ? "Breakdown Risk"
                        : "Observed"}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {latestSignal ? <ScoreBadge score={latestSignal.score} /> : null}
                {latestSignal ? <RiskBadge tier={latestSignal.riskTier} /> : null}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Scan date {latestSignal?.signalDate ?? latest.date}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Latest price" value={formatCurrency(latest.close)} tone="positive" />
          <KpiCard label="Latest scanner score" value={latestSignal?.score ?? "NA"} />
          <KpiCard label="Saved appearances" value={signals.length} />
          <KpiCard label="Proof records" value={proof.length} />
        </div>
      </section>

      <section className="container pb-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Scanner Stage Timeline</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {timeline.length ? (
              timeline.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                        {item.date}
                      </p>
                      <p className="mt-2 font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-xs text-slate-400">{item.setupType}</p>
                      <p className="mt-3 text-xs text-slate-500">
                        Price then {formatCurrency(item.priceThen)}
                      </p>
                    </div>
                    <div className={`rounded-2xl px-3 py-1.5 text-lg font-black tabular-nums ${item.movePct >= 0 ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                      {formatPercent(item.movePct)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No scanner timeline is available for this symbol yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="container grid gap-6 pb-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Daily Chart</h2>
              <p className="text-xs text-slate-500">Scanner reference levels and recent daily structure.</p>
            </div>
          </div>
          <CandlestickChart
            candles={candles}
            pivot={latestSignal?.pivot}
            support={latestSignal?.support}
            target1={latestSignal?.target1}
            target2={latestSignal?.target2}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signal metrics</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <KpiCard label="RSI" value={String(latestSignal?.metrics.rsi ?? "NA")} />
              <KpiCard label="ADX" value={String(latestSignal?.metrics.adx ?? "NA")} />
              <KpiCard label="RS Rank" value={String(latestSignal?.metrics.rsRank ?? "NA")} />
              <KpiCard
                label="Volume ratio / quality"
                value={String(
                  latestSignal?.metrics.volumeRatio ??
                    latestSignal?.metrics.volumeQuality ??
                    "NA"
                )}
              />
              <KpiCard label="ATR" value={String(latestSignal?.metrics.atr ?? "NA")} />
              <KpiCard label="From pivot" value={String(latestSignal?.metrics.fromPivot ?? "NA")} />
            </div>
          </div>

          {latestSignal ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Why it was shortlisted</p>
              <div className="mt-4">
                <EvidenceChecklist rules={latestSignal.evidenceRules} />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm leading-6 text-slate-300">{latestSignal.notes}</p>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Outcome snapshot</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>Latest proof status: <span className="font-semibold text-white">{latestProof?.status ?? "No proof record yet"}</span></p>
              <p>Entry reference: <span className="font-semibold text-white">{latestProof ? formatCurrency(latestProof.entryReference) : "NA"}</span></p>
              <p>Current / exit price: <span className="font-semibold text-white">{latestProof ? formatCurrency(latestProof.currentPrice) : "NA"}</span></p>
              <p>Return since first record: <span className="font-semibold text-white">{latestProof ? formatPercent(latestProof.returnPct) : "NA"}</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <StockDetailTabs symbol={symbol} signals={signals} proof={proof} />
      </section>

      <section className="container pb-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Related Stocks</h2>
          <p className="mt-1 text-xs text-slate-500">
            Same sector names, ranked by latest scanner score across current research pages.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {related.length ? (
              related.map((row) => (
                <Link
                  key={row.symbol}
                  href={`/stocks/${row.symbol}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-400/40 hover:bg-slate-950"
                >
                  <div className="font-bold text-white">{row.symbol}</div>
                  <div className="mt-1 truncate text-xs text-slate-400">{row.companyName}</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-cyan-200">{row.signalLabel}</span>
                    <span className="font-semibold text-white">{row.score.toFixed(1)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-400">No same-sector scanner peers are available right now.</p>
            )}
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <p className="text-sm leading-7 text-slate-400">
          This symbol page is educational research software only. It is not investment advice, trading advice, financial advice, or a recommendation to buy, sell, hold, short, hedge, or transact in any security.
        </p>
      </section>
    </main>
  );
}
