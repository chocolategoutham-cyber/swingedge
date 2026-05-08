import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";
import ScannerPageClient from "@/components/scanners/ScannerPageClient";
import { getPreBreakoutScanner } from "@/lib/api";

export const metadata: Metadata = {
  title: "Pre-Breakout Scanner - NSE Base and Compression Research",
  description: "Find NSE stocks forming constructive bases, compression, improving relative strength, and volume dry-up.",
};

export default async function PreBreakoutPage() {
  const { rows } = await getPreBreakoutScanner();
  const avgRs = rows.reduce((sum, row) => sum + Number(row.metrics.rsRank ?? 0), 0) / rows.length;
  const avgBase = rows.reduce((sum, row) => sum + Number(row.metrics.baseQuality ?? 0), 0) / rows.length;

  return (
    <main>
      <PageHero
        eyebrow="Scanner"
        title="Pre-Breakout Scanner"
        subtitle="Find NSE stocks forming constructive bases, compression, improving relative strength, and volume dry-up."
        metrics={
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Total candidates" value={rows.length} />
            <KpiCard label="Very strong setups" value={rows.filter((row) => row.signalLabel === "Very Strong").length} tone="positive" />
            <KpiCard label="Strong setups" value={rows.filter((row) => row.signalLabel === "Strong").length} />
            <KpiCard label="Watchlist matches" value={rows.filter((row) => row.signalLabel === "Watch").length} tone="warning" />
            <KpiCard label="Avg RS rank" value={avgRs.toFixed(0)} />
            <KpiCard label="Avg base quality" value={avgBase.toFixed(0)} />
          </div>
        }
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container pb-10">
        <ScannerPageClient
          rows={rows}
          mode="pre-breakout"
          emptyDescription="No pre-breakout candidates found. Load mock scan data or run the scanner job."
          sortOptions={[
            { label: "Sort by Score", value: "score" },
            { label: "Sort by RS Rank", value: "rsRank" },
            { label: "Sort by Base Quality", value: "baseQuality" },
            { label: "Sort by From Pivot", value: "fromPivot" },
            { label: "Sort by Volume Dry-Up", value: "volumeDryUp" },
          ]}
        />
      </section>
      <section className="container space-y-10 pb-10">
        <div className="panel">
          <h2 className="text-2xl font-semibold text-white">What is a pre-breakout setup?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            A pre-breakout setup is a research candidate trading near a reference resistance zone while
            price action tightens, volume cools, and trend context remains constructive. SignalLens
            models structure, relative strength, moving-average alignment, and failure-risk boundaries
            before exposing a row in the scanner.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h3 className="text-xl font-semibold text-white">VCP compression</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The scanner looks for smaller pullbacks, tighter closes, and calmer volume inside a base.
              VCP-like behavior is one clue, not a guarantee, and it works best when broader trend context
              is aligned.
            </p>
          </div>
          <div className="panel">
            <h3 className="text-xl font-semibold text-white">Stage 2 trend context</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Moving-average alignment and trend health matter. The model prefers candidates with
              constructive trend state, stronger RS behavior, and contained downside distance to support.
            </p>
          </div>
          <div className="panel">
            <h3 className="text-xl font-semibold text-white">Volume dry-up and base quality</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Lower participation during quiet consolidation can be a positive clue. The platform tracks
              volume behavior and base width to avoid treating noisy ranges as high-quality setups.
            </p>
          </div>
          <div className="panel">
            <h3 className="text-xl font-semibold text-white">How to use this scanner responsibly</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use the rows as research leads only. Review evidence, define a risk boundary, compare against
              Nifty context, and document why the setup could fail before treating it as meaningful.
            </p>
          </div>
        </div>
        <FAQAccordion
          items={[
            { question: "What hides a row by default?", answer: "Scores below the watch threshold are not prioritized because structure, trend, or risk clues are weaker." },
            { question: "Does a Very Strong row mean the trade will work?", answer: "No. It only means more modeled clues aligned at scan time." },
            { question: "Why show pivot and support together?", answer: "The platform shows both upside reference context and nearby risk boundaries." },
          ]}
        />
        <RelatedLinks
          links={[
            { href: "/breakouts", title: "Breakout Scanner", description: "Follow setups after confirmation." },
            { href: "/patterns/vcp", title: "VCP Guide", description: "Understand volatility contraction behavior." },
            { href: "/proof-board", title: "Proof Board", description: "Audit historical outcomes and failure cases." },
            { href: "/how-we-scan-stocks", title: "Methodology", description: "Read the scanner philosophy and vocabulary." },
          ]}
        />
      </section>
    </main>
  );
}
