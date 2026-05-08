import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";
import ScannerPageClient from "@/components/scanners/ScannerPageClient";
import { mockBreakdownSignals } from "@/lib/data/mock-scanner-runs";

export const metadata: Metadata = {
  title: "Breakdown Risk Scanner - NSE Bearish Structure Research",
  description: "Track NSE stocks showing support loss, bearish moving-average structure, weak relative strength, and distribution pressure.",
};

export default function BreakdownsPage() {
  const rows = mockBreakdownSignals;
  const avgDistribution = rows.reduce((sum, row) => sum + Number(row.metrics.distributionCount ?? 0), 0) / rows.length;
  const avgWeakRs = rows.reduce((sum, row) => sum + (100 - Number(row.metrics.rsRank ?? 0)), 0) / rows.length;

  return (
    <main>
      <PageHero
        eyebrow="Scanner"
        title="Breakdown Risk Scanner"
        subtitle="Track NSE stocks showing support loss, bearish moving-average structure, weak relative strength, and distribution pressure."
        metrics={
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Total risk flags" value={rows.length} tone="risk" />
            <KpiCard label="Severe risk" value={rows.filter((row) => row.riskTier === "Severe").length} tone="risk" />
            <KpiCard label="High risk" value={rows.filter((row) => row.riskTier === "High").length} tone="warning" />
            <KpiCard label="Moderate risk" value={rows.filter((row) => row.riskTier === "Moderate").length} />
            <KpiCard label="Avg distribution count" value={avgDistribution.toFixed(1)} />
            <KpiCard label="Avg RS weakness" value={avgWeakRs.toFixed(0)} />
          </div>
        }
      />
      <section className="container py-8 space-y-4">
        <ImportantDisclaimer />
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-100">
          This page does not tell users to short, exit, hedge, or avoid a security.
          It only shows bearish model context.
        </div>
      </section>
      <section className="container pb-10">
        <ScannerPageClient
          rows={rows}
          mode="breakdown"
          emptyDescription="No breakdown-risk candidates found. Load mock scan data or run the scanner job."
          patternOptions={[
            { label: "All", value: "All" },
            { label: "Support Loss", value: "Support Loss" },
            { label: "Retest Failure", value: "Retest Failure" },
            { label: "Lower High", value: "Lower High" },
            { label: "Bearish DMA", value: "Bearish DMA" },
            { label: "Distribution Cluster", value: "Distribution Cluster" },
          ]}
          riskOptions={[
            { label: "All", value: "All" },
            { label: "Severe", value: "Severe" },
            { label: "High", value: "High" },
            { label: "Moderate", value: "Moderate" },
          ]}
          sortOptions={[
            { label: "Sort by Risk Score", value: "riskScore" },
            { label: "Sort by From Support", value: "fromSupport" },
            { label: "Sort by Distribution Count", value: "distributionCount" },
            { label: "Sort by RS Rank", value: "rsRank" },
            { label: "Sort by RSI", value: "rsi" },
          ]}
        />
      </section>
      <section className="container space-y-10 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">What is bearish structure?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The model looks for support loss, lower highs, weaker moving-average alignment, and distribution-style sessions.
              It presents risk context only so users can study deterioration rather than treat it as an instruction.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">Support-loss detection</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              A support-loss clue appears when price closes meaningfully below a recent pivot-low zone and fails to recover quickly.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">Distribution pressure</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Distribution days combine weak closes, above-average volume, and wider ranges to suggest risk appetite is fading.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">How practitioners use scans responsibly</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Risk scans are often paired with watchlist maintenance, hedging research, or regime review. They are not substitutes for a full process.
            </p>
          </div>
        </div>
        <FAQAccordion
          items={[
            { question: "Does severe risk mean the stock will fall further?", answer: "No. It only means more downside-risk clues are present in the model." },
            { question: "Why show bearish pages on a research dashboard?", answer: "Because good research includes both opportunity context and failure-risk context." },
            { question: "Can a bearish flag disappear quickly?", answer: "Yes. Strong recoveries can repair structure and change the model context." },
          ]}
        />
        <RelatedLinks
          links={[
            { href: "/nifty", title: "Nifty Context", description: "Compare stock-level weakness with broader market conditions." },
            { href: "/insights", title: "Insights", description: "Watch breadth and sector rotation for broader weakness." },
            { href: "/proof-board", title: "Proof Board", description: "Review how invalidations and stop/reference breaches are tracked." },
            { href: "/how-we-scan-stocks", title: "Methodology", description: "Read the risk-model vocabulary and boundaries." },
          ]}
        />
      </section>
    </main>
  );
}
