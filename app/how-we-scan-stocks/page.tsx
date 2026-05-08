import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import RelatedLinks from "@/components/common/RelatedLinks";

export const metadata: Metadata = {
  title: "How We Scan Stocks",
  description: "Explain the market universe, scanner philosophy, update frequency, vocabulary, and risk boundaries.",
};

export default function MethodologyPage() {
  return (
    <main>
      <PageHero eyebrow="Methodology" title="How We Scan Stocks" subtitle="Research candidates, not calls. Multiple clues, not one indicator. Exact formulas can remain configurable and private." />
      <section className="container py-8"><ImportantDisclaimer /></section>
      <section className="container space-y-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            "Research candidates, not calls",
            "Multiple clues, not one indicator",
            "Exact formulas can remain configurable/private",
          ].map((principle) => (
            <div key={principle} className="panel text-sm text-slate-300">{principle}</div>
          ))}
        </div>
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-white">Market universe</h2>
          <p className="text-sm leading-7 text-slate-300">SignalLens models NSE-listed equities with mock Large-Mid, Small Cap, and Micro Cap sleeves. Liquidity filters exclude stale or thin data in the first version.</p>
        </div>
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-white">Technical vocabulary</h2>
          <p className="text-sm leading-7 text-slate-300">Consolidation, VCP, relative strength, breakout proximity, volume-price behavior, liquidity, trend alignment, momentum behavior, failure risk, proof-board history, and bearish setup all appear throughout the platform.</p>
        </div>
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-white">Scanner types</h2>
          <p className="text-sm leading-7 text-slate-300">Pre-Breakout, Breakout, Bearish Setup, Momentum, Nifty context, and Insights each answer a different research question. Proof Board archives appearances and historical outcomes.</p>
        </div>
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-white">Update frequency</h2>
          <p className="text-sm leading-7 text-slate-300">Scanner pages refresh after market close in the intended architecture. Nifty context refreshes during market hours. Insights refresh with market data, while proof records update from scanner appearances and later outcomes.</p>
        </div>
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-white">Balanced expectations</h2>
          <p className="text-sm leading-7 text-slate-300">Scanner outputs can be wrong. Historical outcomes do not guarantee future results. Users remain responsible for any decision they make after reviewing research software.</p>
        </div>
        <RelatedLinks links={[{ href: "/disclaimer", title: "Risk Disclaimer", description: "Read the full risk disclosure." }, { href: "/learn", title: "Learning Hub", description: "Continue with patterns and risk basics." }, { href: "/pre-breakout", title: "Pre-Breakout", description: "See methodology applied to live mock rows." }, { href: "/proof-board", title: "Proof Board", description: "Inspect how appearances turn into outcomes." }]} />
      </section>
    </main>
  );
}
