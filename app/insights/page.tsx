import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import RelatedLinks from "@/components/common/RelatedLinks";
import SectorHeatmap from "@/components/insights/SectorHeatmap";
import BreadthPanel from "@/components/insights/BreadthPanel";
import { getInsights } from "@/lib/api";

export const metadata: Metadata = {
  title: "NSE Market Insights - Sector Rotation and Breadth",
  description: "Sector rotation, breadth, and relative strength summaries to pair with scanner research.",
};

export default async function InsightsPage() {
  const insights = await getInsights();
  const sectors = insights.sectors;

  return (
    <main>
      <PageHero
        eyebrow="Insights"
        title="NSE Market Insights"
        subtitle="Sector rotation, breadth, and relative strength summaries to pair with scanner research."
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Market pulse" value={insights.marketPulse} />
          <KpiCard label="Breadth gauge" value={insights.breadthLabel} />
          <KpiCard label="Sector leadership" value={sectors[0].sector} tone="positive" />
          <KpiCard label="Risk regime" value={insights.riskRegime} tone="warning" />
          <KpiCard label="New highs / lows" value={`${insights.newHighs}/${insights.newLows}`} />
          <KpiCard label="A/D ratio" value={insights.advanceDeclineRatio.toFixed(2)} />
        </div>
      </section>
      <section className="container pb-10">
        <div className="panel">
          <div className="flex flex-wrap gap-2">
            {["Sector Rotation", "Breadth", "Relative Strength", "Risk Context"].map((tab) => (
              <span key={tab} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-200">{tab}</span>
            ))}
          </div>
          <div className="mt-6">
            <SectorHeatmap rows={sectors} />
          </div>
        </div>
      </section>
      <section className="container pb-10">
        <BreadthPanel
          advancers={insights.advancers}
          decliners={insights.decliners}
          unchanged={insights.unchanged}
          ratio={insights.advanceDeclineRatio}
          above20={insights.percentAbove20dma}
          above50={insights.percentAbove50dma}
          above200={insights.percentAbove200dma}
        />
      </section>
      <section className="container pb-10">
        <RelatedLinks
          links={[
            { href: "/breakouts", title: "Breakouts", description: "Research confirmed expansion with market context." },
            { href: "/pre-breakout", title: "Pre-Breakout", description: "Look for bases while leadership remains constructive." },
            { href: "/breakdowns", title: "Breakdown Risk", description: "Watch for market-wide weakness and sector deterioration." },
            { href: "/nifty", title: "Nifty Signals", description: "Index-level trend and OI context." },
          ]}
        />
      </section>
    </main>
  );
}
