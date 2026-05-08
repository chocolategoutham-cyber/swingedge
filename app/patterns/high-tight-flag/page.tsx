import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";

export const metadata: Metadata = {
  title: "High Tight Flag Guide",
  description: "Educational guide to HTF-style momentum behavior and how the scanner tags similar conditions.",
};

export default function HtfPage() {
  return (
    <main>
      <PageHero eyebrow="Pattern guide" title="High Tight Flag Guide" subtitle="Learn the structure, volatility, and risk notes behind HTF-style momentum behavior." />
      <section className="container py-8"><ImportantDisclaimer /></section>
      <section className="container space-y-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel"><h2 className="text-2xl font-semibold text-white">Structure</h2><p className="mt-4 text-sm leading-7 text-slate-300">A strong price pole, controlled pullback, tighter flag, softer volume, and persistent relative strength are common HTF-style clues.</p></div>
          <div className="panel"><h2 className="text-2xl font-semibold text-white">Volatility disclosure</h2><p className="mt-4 text-sm leading-7 text-slate-300">These patterns can be highly volatile and are often late-stage. Educational tagging does not reduce real market risk.</p></div>
        </div>
        <div className="panel"><h3 className="text-xl font-semibold text-white">How the scanner tags HTF candidates</h3><p className="mt-3 text-sm leading-7 text-slate-300">SignalLens checks for a strong run-up, contained pullback depth, RS persistence, and acceptable volume behavior during the pause.</p></div>
        <div className="panel"><h3 className="text-xl font-semibold text-white">Failure modes</h3><p className="mt-3 text-sm leading-7 text-slate-300">Overextension, sudden market risk-off behavior, and heavy rejection near highs can quickly damage the setup.</p></div>
        <FAQAccordion items={[{ question: "Does an HTF label mean higher confidence?", answer: "No. It only describes a pattern archetype inside the research model." }]} />
        <RelatedLinks links={[{ href: "/breakouts", title: "Breakout Scanner", description: "See current HTF-style rows." }, { href: "/momentum-stocks", title: "Momentum Leaders", description: "Compare HTF behavior with broader RS leaders." }, { href: "/learn", title: "Learning Hub", description: "Continue with related pattern topics." }, { href: "/proof-board", title: "Proof Board", description: "Review mixed historical outcomes." }]} />
      </section>
    </main>
  );
}
