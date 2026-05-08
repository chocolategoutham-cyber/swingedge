"use client";

import type { DailyCandle, ScannerSignal } from "@/lib/types";
import CandlestickChart from "@/components/charts/CandlestickChart";
import EvidenceChecklist from "@/components/scanners/EvidenceChecklist";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";

export default function StockAnalyzeDrawer({
  signal,
  candles,
  open,
  onClose,
}: {
  signal: ScannerSignal | null;
  candles: DailyCandle[];
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !signal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/80">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">{signal.scannerType}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{signal.symbol}</h3>
            <p className="text-sm text-slate-400">{signal.companyName}</p>
          </div>
          <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-6">
          <CandlestickChart
            candles={candles}
            pivot={signal.pivot}
            support={signal.support}
            target1={signal.target1}
            target2={signal.target2}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reference zone</p>
            <p className="mt-2 text-sm text-slate-200">Pivot: {signal.pivot?.toFixed(2) ?? "NA"}</p>
            <p className="mt-1 text-sm text-slate-200">Support: {signal.support?.toFixed(2) ?? "NA"}</p>
            <p className="mt-1 text-sm text-slate-200">Stop reference: {signal.stopReference.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Research levels</p>
            <p className="mt-2 text-sm text-slate-200">Target 1: {signal.target1.toFixed(2)}</p>
            <p className="mt-1 text-sm text-slate-200">Target 2: {signal.target2.toFixed(2)}</p>
            <p className="mt-1 text-sm text-slate-200">Updated: {new Date(signal.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white">Evidence checklist</h4>
          <div className="mt-4">
            <EvidenceChecklist rules={signal.evidenceRules} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-lg font-semibold text-white">Risk notes</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">{signal.notes}</p>
        </div>

        <div className="mt-6">
          <ImportantDisclaimer />
        </div>
      </div>
    </div>
  );
}
