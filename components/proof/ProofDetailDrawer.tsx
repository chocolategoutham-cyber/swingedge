"use client";

import type { ProofRecord } from "@/lib/types";
import EvidenceChecklist from "@/components/scanners/EvidenceChecklist";
import StatusBadge from "@/components/common/StatusBadge";

export default function ProofDetailDrawer({
  record,
  open,
  onClose,
}: {
  record: ProofRecord | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !record) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/80">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Proof detail</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{record.symbol}</h3>
            <div className="mt-3">
              <StatusBadge status={record.status} />
            </div>
          </div>
          <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p>First seen: {record.firstSeenDate}</p>
            <p className="mt-2">Entry reference: {record.entryReference.toFixed(2)}</p>
            <p className="mt-2">Stop reference: {record.stopReference.toFixed(2)}</p>
            <p className="mt-2">Target 1: {record.target1.toFixed(2)}</p>
            <p className="mt-2">Target 2: {record.target2.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p>Current/Exit price: {(record.exitPrice ?? record.currentPrice).toFixed(2)}</p>
            <p className="mt-2">Return: {record.returnPct.toFixed(1)}%</p>
            <p className="mt-2">Holding days: {record.holdingDays}</p>
            <p className="mt-2">Original score: {record.originalScore}</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="text-lg font-semibold text-white">Timeline</h4>
          <div className="mt-4 space-y-3">
            {record.timeline.map((event) => (
              <div key={`${event.date}-${event.title}`} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-sm font-medium text-white">{event.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{event.date}</p>
                <p className="mt-2 text-sm text-slate-300">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white">Original conditions</h4>
          <div className="mt-4">
            <EvidenceChecklist rules={record.evidenceRules} />
          </div>
        </div>
      </div>
    </div>
  );
}
