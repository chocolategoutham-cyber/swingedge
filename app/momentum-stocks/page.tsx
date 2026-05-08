import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";
import ScannerPageClient from "@/components/scanners/ScannerPageClient";
import { getMomentumScanner } from "@/lib/api";

export const metadata: Metadata = {
  title: "Momentum Stocks - Relative Strength Leaders",
  description: "Track stocks persistently outperforming benchmarks with orderly trends and supportive volume.",
};

export default async function MomentumPage() {
  const { rows } = await getMomentumScanner();
  return (
    <main>
      <PageHero
        eyebrow="Momentum"
        title="Momentum Stocks - Relative Strength Leaders"
        subtitle="Track stocks persistently outperforming benchmarks with orderly trends and supportive volume."
        metrics={
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            <KpiCard label="Leaders tracked" value={rows.length} />
            <KpiCard label="Avg RS rank" value={(rows.reduce((sum, row) => sum + Number(row.metrics.rsRank ?? 0), 0) / rows.length).toFixed(0)} tone="positive" />
            <KpiCard label="Bullish trend stage" value={rows.filter((row) => row.metrics.trendStage === "Stage 2").length} />
            <KpiCard label="Contained risk labels" value={rows.filter((row) => row.riskTier === "Low").length} />
          </div>
        }
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container pb-10">
        <ScannerPageClient
          rows={rows}
          mode="momentum"
          emptyDescription="No momentum leaders found. Load mock data or refresh the leader model."
          sortOptions={[
            { label: "Sort by Score", value: "score" },
            { label: "Sort by RS Rank", value: "rsRank" },
            { label: "Sort by 1M Return", value: "return1m" },
            { label: "Sort by 3M Return", value: "return3m" },
            { label: "Sort by Volume Trend", value: "volumeRatio" },
          ]}
        />
      </section>
      <section className="container grid gap-6 pb-10 lg:grid-cols-3">
        <div className="panel"><h2 className="text-xl font-semibold text-white">Inputs that define leadership</h2><p className="mt-3 text-sm leading-7 text-slate-300">Rolling returns, RS rank, trend alignment, and supportive volume all contribute to leadership scoring.</p></div>
        <div className="panel"><h2 className="text-xl font-semibold text-white">Suggested research flow</h2><p className="mt-3 text-sm leading-7 text-slate-300">Start with RS leaders, inspect chart orderliness, compare with sector leadership, then define the risk boundary before continuing research.</p></div>
        <div className="panel"><h2 className="text-xl font-semibold text-white">Common pitfalls</h2><p className="mt-3 text-sm leading-7 text-slate-300">Late-stage extension, crowded themes, and weakening volume can all reduce the value of a high RS rank.</p></div>
      </section>
      <section className="container pb-10">
        <FAQAccordion
          items={[
            { question: "Does leadership mean low risk?", answer: "No. Momentum leaders can still be highly extended or volatile." },
            { question: "Why include volume trend?", answer: "Volume behavior helps distinguish orderly leadership from thin or unstable moves." },
          ]}
        />
      </section>
      <section className="container pb-10">
        <RelatedLinks
          links={[
            { href: "/breakouts", title: "Breakout Scanner", description: "See leaders that have already confirmed momentum." },
            { href: "/insights", title: "Market Insights", description: "Compare leaders with sector rotation." },
            { href: "/learn", title: "Learning Hub", description: "Study relative strength and momentum behavior." },
            { href: "/proof-board", title: "Proof Board", description: "Review historical outcome behavior." },
          ]}
        />
      </section>
    </main>
  );
}
