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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol} - Stock Research Detail`,
    description: `Scanner appearances, chart context, indicator lens, and proof history for ${symbol}.`,
  };
}

function formatCurrency(value?: number) {
  if (value == null || Number.isNaN(value)) return "NA";
  return `Rs ${value.toFixed(2)}`;
}

function formatPercent(value?: number) {
  if (value == null || Number.isNaN(value)) return "NA";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
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

  const {
    stock,
    signals,
    proof,
    candles,
    overview,
    latestSignal,
    chartLevels,
    insightCards,
    stageTimeline,
    proofSnapshot,
    referenceTexts,
  } = detail;

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

  return (
    <main>
      <PageHero
        eyebrow="Stock detail"
        title={symbol}
        subtitle={`${stock.companyName}. Review scanner status, chart levels, shortlist evidence, proof history, and same-sector context in one place.`}
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
                {overview.shortlistNarrative}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {overview.sector}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                  {overview.marketCapBucket}
                </span>
                {overview.setupType ? (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                    {overview.setupType}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="min-w-[240px] rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest status</p>
              <p className="mt-2 text-2xl font-black text-white">{overview.statusLabel}</p>
              <div className="mt-3 flex items-center gap-3">
                {latestSignal ? <ScoreBadge score={latestSignal.score} /> : null}
                {latestSignal ? <RiskBadge tier={latestSignal.riskTier} /> : null}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Scan date {overview.scanDate ?? "NA"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Latest price" value={formatCurrency(overview.latestPrice)} tone="positive" />
          <KpiCard label="Latest scanner score" value={overview.latestScore ?? "NA"} />
          <KpiCard label="Saved appearances" value={overview.savedAppearances} />
          <KpiCard label="Proof records" value={overview.proofCount} />
        </div>
      </section>

      <section className="container pb-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold text-white">Scanner Stage Timeline</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {stageTimeline.length ? (
              stageTimeline.map((item) => (
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
              <p className="text-xs text-slate-500">{overview.chartNote}</p>
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
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signal lens</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {insightCards.map((card) => (
                <div key={card.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{card.value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {latestSignal ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Why it was shortlisted</p>
              <div className="mt-4">
                <EvidenceChecklist rules={latestSignal.evidenceRules} />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm leading-6 text-slate-300">{referenceTexts.scannerSummary}</p>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reference levels</p>
            <div className="mt-4 grid gap-3">
              {chartLevels.map((level) => (
                <div key={level.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{level.label}</p>
                    <p className="text-sm font-semibold text-slate-200">{formatCurrency(level.value)}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{level.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Outcome snapshot</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>Latest proof status: <span className="font-semibold text-white">{proofSnapshot?.status ?? "No proof record yet"}</span></p>
              <p>Entry reference: <span className="font-semibold text-white">{proofSnapshot ? formatCurrency(proofSnapshot.entryReference) : "NA"}</span></p>
              <p>Current / exit price: <span className="font-semibold text-white">{proofSnapshot ? formatCurrency(proofSnapshot.currentPrice) : "NA"}</span></p>
              <p>Return since first record: <span className="font-semibold text-white">{proofSnapshot ? formatPercent(proofSnapshot.returnPct) : "NA"}</span></p>
              {proofSnapshot ? (
                <p className="text-xs leading-5 text-slate-500">{proofSnapshot.note}</p>
              ) : null}
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
