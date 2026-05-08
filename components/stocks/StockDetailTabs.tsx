"use client";

import { useState } from "react";
import type { ProofRecord, ScannerSignal } from "@/lib/types";
import StatusBadge from "@/components/common/StatusBadge";

type TabKey = "overview" | "pre-breakout" | "breakout" | "breakdown" | "proof" | "indicators";

export default function StockDetailTabs({
  symbol,
  signals,
  proof,
}: {
  symbol: string;
  signals: ScannerSignal[];
  proof: ProofRecord[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "pre-breakout", label: "Pre-Breakout" },
    { key: "breakout", label: "Breakout" },
    { key: "breakdown", label: "Breakdown Risk" },
    { key: "proof", label: "Proof History" },
    { key: "indicators", label: "Indicators" },
  ];

  const byType = (type: ScannerSignal["scannerType"]) => signals.filter((signal) => signal.scannerType === type);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            className={`rounded-full px-4 py-2 text-sm ${tab === item.key ? "bg-white text-slate-950" : "bg-slate-900 text-slate-200"}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" ? (
          <div className="space-y-3 text-sm text-slate-300">
            <p>{symbol} appears in {signals.length} recent scanner views across momentum, structure, and risk models.</p>
            <p>Use the tabs to compare constructive setups, bearish context, proof history, and indicator snapshots.</p>
          </div>
        ) : null}

        {tab === "pre-breakout" ? (
          <SignalList title="Recent pre-breakout appearances" rows={byType("pre-breakout")} />
        ) : null}
        {tab === "breakout" ? (
          <SignalList title="Recent breakout appearances" rows={byType("breakout")} />
        ) : null}
        {tab === "breakdown" ? (
          <SignalList title="Recent breakdown-risk appearances" rows={byType("breakdown")} />
        ) : null}
        {tab === "proof" ? (
          <div className="space-y-3">
            {proof.map((record) => (
              <div key={record.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{record.setupType}</p>
                  <StatusBadge status={record.status} />
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  First seen {record.firstSeenDate}, return {record.returnPct.toFixed(1)}%, holding days {record.holdingDays}.
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {tab === "indicators" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {signals[0]
              ? Object.entries(signals[0].metrics)
                  .slice(0, 10)
                  .map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{key}</p>
                      <p className="mt-2 text-lg text-white">{String(value)}</p>
                    </div>
                  ))
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SignalList({ title, rows }: { title: string; rows: ScannerSignal[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map((signal) => (
            <div key={signal.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white">{signal.setupType}</p>
                <p className="text-sm text-slate-300">{signal.score}</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">{signal.notes}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No recent appearances in this model bucket.</p>
        )}
      </div>
    </div>
  );
}
