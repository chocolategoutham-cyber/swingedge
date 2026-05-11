import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import PerformanceCharts from "@/components/charts/PerformanceCharts";
import ProofBoardClient from "@/components/proof/ProofBoardClient";
import { getProofBoard } from "@/lib/api";

export const metadata: Metadata = {
  title: "Proof Board - Scanner Outcome Tracker",
  description: "Review historical scanner appearances, follow-through, failure cases, and outcome metrics.",
};

export default async function ProofBoardPage() {
  const proofBoard = await getProofBoard();
  const { kpis } = proofBoard;
  const topFollowThrough = [...proofBoard.rows]
    .filter((record) => record.returnPct > 0)
    .sort((left, right) => right.returnPct - left.returnPct)
    .slice(0, 5);
  const statusBreakdown = [
    { name: "Open", value: proofBoard.rows.filter((record) => record.status === "Open").length, color: "#3b82f6" },
    { name: "Target", value: proofBoard.rows.filter((record) => ["Target 2 Hit", "Target 1 Hit", "Partial Target"].includes(record.status)).length, color: "#10b981" },
    { name: "Stop", value: proofBoard.rows.filter((record) => record.status === "Stop/Reference Breach").length, color: "#ef4444" },
    { name: "Expired", value: proofBoard.rows.filter((record) => record.status === "Expired").length, color: "#94a3b8" },
    { name: "Invalidated", value: proofBoard.rows.filter((record) => record.status === "Invalidated").length, color: "#f59e0b" },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Transparency"
        title="Proof Board - Scanner Outcome Tracker"
        subtitle="Review historical scanner appearances, model evidence, follow-through, failure cases, and outcome metrics."
        metrics={
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Total tracked" value={kpis.totalTrackedSignals} />
            <KpiCard label="Closed signals" value={kpis.closedSignals} />
            <KpiCard label="Open signals" value={kpis.openSignals} />
            <KpiCard label="Target hit count" value={kpis.targetHitCount} tone="positive" />
            <KpiCard label="Stop/reference breaches" value={kpis.stopReferenceBreachCount} tone="risk" />
            <KpiCard label="Win rate" value={`${kpis.winRate}%`} tone="warning" />
          </div>
        }
      />
      <section className="container py-8 space-y-4">
        <ImportantDisclaimer />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "No cherry picking",
            "Winners and losers shown",
            "Open records separated from closed outcomes",
            "Rules and timestamps visible",
          ].map((item) => (
            <div key={item} className="panel text-sm text-slate-300">{item}</div>
          ))}
        </div>
      </section>
      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Average return" value={`${kpis.averageReturn}%`} />
          <KpiCard label="Median holding days" value={kpis.medianHoldingDays} />
          <KpiCard label="Max drawdown" value={`${kpis.maxDrawdown}%`} tone="risk" />
          <KpiCard label="Expired count" value={kpis.expiredCount} />
          <KpiCard label="Best outcome" value={`${kpis.bestOutcome}%`} tone="positive" />
          <KpiCard label="Worst outcome" value={`${kpis.worstOutcome}%`} tone="risk" />
        </div>
      </section>
      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {topFollowThrough.map((record, index) => (
            <div key={record.id} className="panel">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                Win #{index + 1}
              </p>
              <p className="mt-3 text-2xl font-black text-emerald-300">
                +{record.returnPct.toFixed(1)}%
              </p>
              <p className="mt-2 font-semibold text-white">{record.symbol}</p>
              <p className="text-xs text-slate-400">{record.companyName}</p>
              <p className="mt-3 text-xs text-slate-500">
                Identified by {record.scannerSource} on {record.firstSeenDate}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {record.entryReference.toFixed(2)} to {(record.exitPrice ?? record.currentPrice).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="container pb-10">
        <PerformanceCharts
          equityCurve={proofBoard.equityCurve}
          monthlyStats={proofBoard.monthlyStats}
          returnDistribution={proofBoard.returnDistribution}
          statusBreakdown={statusBreakdown}
        />
      </section>
      <section className="container pb-10">
        <ProofBoardClient records={proofBoard.rows} />
      </section>
      <section className="container space-y-8 pb-10">
        <div className="panel space-y-4 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-semibold text-white">How outcomes are tracked</h2>
          <p>Each signal creates a proof record on first appearance. Records preserve timestamps, original score, evidence checklist, and later outcome updates.</p>
          <p>Open signals are excluded from win-rate calculations. Closed signals include target outcomes, stop/reference breaches, expired setups, and invalidated setups.</p>
          <p>Historical outcomes do not guarantee future results and should never be treated as performance promises.</p>
        </div>
        <FAQAccordion
          items={[
            { question: "Are losing signals shown?", answer: "Yes. The proof board deliberately includes stop/reference breaches, expiries, and invalidations." },
            { question: "What counts as a target hit?", answer: "Target status depends on whether the mock path reached target 1 or target 2 before other closure conditions." },
            { question: "Do open signals count in win rate?", answer: "No. Only closed records are included in win-rate and average-return calculations." },
            { question: "Is this investment advice?", answer: "No. Proof tracking is educational reporting only." },
          ]}
        />
      </section>
    </main>
  );
}
