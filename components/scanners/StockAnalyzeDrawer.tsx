"use client";

import type { StockDetailApiResponse } from "@/lib/api";
import CandlestickChart from "@/components/charts/CandlestickChart";
import EvidenceChecklist from "@/components/scanners/EvidenceChecklist";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import ScoreBadge from "@/components/common/ScoreBadge";
import RiskBadge from "@/components/common/RiskBadge";

export default function StockAnalyzeDrawer({
  detail,
  open,
  onClose,
}: {
  detail: StockDetailApiResponse | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !detail) return null;

  const { stock, candles, latestSignal, overview, chartLevels, insightCards, stageTimeline, proofSnapshot, referenceTexts } = detail;
  if (!latestSignal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/80">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">{latestSignal.scannerType}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{stock.symbol}</h3>
            <p className="text-sm text-slate-400">{stock.companyName}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ScoreBadge score={latestSignal.score} />
              <RiskBadge tier={latestSignal.riskTier} />
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {overview.statusLabel}
              </span>
            </div>
          </div>
          <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-6">
          <CandlestickChart
            candles={candles}
            pivot={latestSignal.pivot}
            support={latestSignal.support}
            target1={latestSignal.target1}
            target2={latestSignal.target2}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Shortlist summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{referenceTexts.scannerSummary}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Chart context</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{referenceTexts.chartSummary}</p>
            <p className="mt-3 text-xs text-slate-500">Updated {new Date(overview.lastUpdated).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-lg font-semibold text-white">Reference levels</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {chartLevels.map((level) => (
              <div key={level.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{level.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{level.value.toFixed(2)}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-lg font-semibold text-white">Model lens</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {insightCards.map((card) => (
              <div key={card.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white">Evidence checklist</h4>
          <div className="mt-4">
            <EvidenceChecklist rules={latestSignal.evidenceRules} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-lg font-semibold text-white">Scanner journey</h4>
          <div className="mt-3 space-y-3">
            {stageTimeline.slice(-3).map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{event.date}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{event.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{event.setupType}</p>
                  </div>
                  <p className={`text-sm font-semibold ${event.movePct >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {event.movePct >= 0 ? "+" : ""}
                    {event.movePct.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {proofSnapshot ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-lg font-semibold text-white">Outcome snapshot</h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">{proofSnapshot.note}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
                <p className="mt-2 text-base font-semibold text-white">{proofSnapshot.status}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Return / holding days</p>
                <p className="mt-2 text-base font-semibold text-white">
                  {proofSnapshot.returnPct >= 0 ? "+" : ""}
                  {proofSnapshot.returnPct.toFixed(1)}% / {proofSnapshot.holdingDays}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-lg font-semibold text-white">Risk notes</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">{latestSignal.notes}</p>
        </div>

        <div className="mt-6">
          <ImportantDisclaimer />
        </div>
      </div>
    </div>
  );
}
