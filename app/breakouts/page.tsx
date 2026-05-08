import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";
import ScannerPageClient from "@/components/scanners/ScannerPageClient";
import { getBreakoutScanner } from "@/lib/api";

export const metadata: Metadata = {
  title: "Breakout Scanner - NSE Momentum and Volume Research",
  description: "Track NSE stocks with confirmed breakout, continuation, high-tight-flag, and momentum patterns.",
};

export default async function BreakoutsPage() {
  const { rows } = await getBreakoutScanner();
  const avgVolumeRatio = rows.reduce((sum, row) => sum + Number(row.metrics.volumeRatio ?? 0), 0) / rows.length;

  return (
    <main>
      <PageHero
        eyebrow="Scanner"
        title="Breakout Scanner"
        subtitle="Track NSE stocks with confirmed breakout, continuation, high-tight-flag, and momentum patterns."
        metrics={
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Total breakouts" value={rows.length} />
            <KpiCard label="Strong breakouts" value={rows.filter((row) => row.signalLabel === "Strong").length} tone="positive" />
            <KpiCard label="Fresh breakouts" value={rows.filter((row) => row.metrics.freshBreakout === true).length} />
            <KpiCard label="HTF candidates" value={rows.filter((row) => row.metrics.htf === true).length} tone="warning" />
            <KpiCard label="Continuation setups" value={rows.filter((row) => row.metrics.continuation === true).length} />
            <KpiCard label="Avg volume ratio" value={avgVolumeRatio.toFixed(2)} />
          </div>
        }
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container pb-10">
        <ScannerPageClient
          rows={rows}
          mode="breakout"
          emptyDescription="No breakout candidates found. Load mock scan data or run the scanner job."
          patternOptions={[
            { label: "All", value: "All" },
            { label: "HTF", value: "HTF" },
            { label: "Active Breakout", value: "Active Breakout" },
            { label: "Fresh Breakout", value: "Fresh Breakout" },
            { label: "Continuation", value: "Continuation" },
          ]}
          sortOptions={[
            { label: "Sort by Score", value: "score" },
            { label: "Sort by Gain 10D", value: "gain10d" },
            { label: "Sort by Gain 20D", value: "gain20d" },
            { label: "Sort by Volume Ratio", value: "volumeRatio" },
            { label: "Sort by RS Rank", value: "rsRank" },
          ]}
        />
      </section>
      <section className="container space-y-10 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">What is a breakout?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              In this product, a breakout is a close above a reference pivot with stronger participation,
              trend follow-through, and RS support. The model distinguishes fresh expansion, continuation,
              and HTF-like behavior without presenting execution advice.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">Volume confirmation</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Breakout rows emphasize volume ratio, recent momentum, and extension from the pivot so users
              can see whether follow-through still looks orderly or already overstretched.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">High Tight Flag</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              HTF-style candidates are tagged when a strong price pole is followed by a tight pause with
              calmer volume and strong RS. They remain educational labels, not trading instructions.
            </p>
          </div>
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">Continuation setups</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Continuation logic favors stocks already trending well that pause without severe damage, then
              resume expansion with evidence of demand still present.
            </p>
          </div>
        </div>
        <FAQAccordion
          items={[
            { question: "Why can a breakout still be risky?", answer: "Extension, weak volume, and fast reversals can reduce quality even when a pivot is cleared." },
            { question: "What is the difference between Fresh Breakout and Continuation?", answer: "Fresh Breakout marks a first-style confirmation; Continuation assumes trend persistence after a controlled pause." },
            { question: "Does High Tight Flag imply higher conviction?", answer: "It marks a different pattern profile, not a promise of stronger future returns." },
          ]}
        />
        <RelatedLinks
          links={[
            { href: "/pre-breakout", title: "Pre-Breakout", description: "See candidates before confirmation." },
            { href: "/patterns/high-tight-flag", title: "High Tight Flag Guide", description: "Learn how the model tags HTF-style behavior." },
            { href: "/momentum-stocks", title: "Momentum Leaders", description: "Track persistent RS strength." },
            { href: "/proof-board", title: "Proof Board", description: "Review outcomes after breakout appearances." },
          ]}
        />
      </section>
    </main>
  );
}
