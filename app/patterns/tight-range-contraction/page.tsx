import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";

export const metadata: Metadata = {
  title: "Tight Range Contraction Guide",
  description: "Educational guide to tight sideways continuation behavior and how it differs from VCP logic.",
};

export default function TrcPage() {
  return (
    <main>
      <PageHero eyebrow="Pattern guide" title="Tight Range Contraction Guide" subtitle="Study sideways continuation behavior, quieter volume, and the differences from broader VCP structure." />
      <section className="container py-8"><ImportantDisclaimer /></section>
      <section className="container space-y-8 pb-10">
        <div className="panel"><h2 className="text-2xl font-semibold text-white">What analysts mean by tight</h2><p className="mt-4 text-sm leading-7 text-slate-300">A tight range is a compact area where price fluctuation narrows and volatility declines without severe damage to the prevailing trend.</p></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel"><h3 className="text-xl font-semibold text-white">Scanner reference bands</h3><p className="mt-3 text-sm leading-7 text-slate-300">The model compares range width, moving averages, and volume behavior to determine whether a pause is orderly enough to classify as tight.</p></div>
          <div className="panel"><h3 className="text-xl font-semibold text-white">Relationship to continuation</h3><p className="mt-3 text-sm leading-7 text-slate-300">Tight ranges can support continuation logic when trend quality remains healthy and volume does not contradict the setup.</p></div>
        </div>
        <div className="panel"><h3 className="text-xl font-semibold text-white">Differences from VCP</h3><p className="mt-3 text-sm leading-7 text-slate-300">VCP emphasizes multiple contractions over a broader base. Tight range contraction may describe a shorter pause inside an existing trend.</p></div>
        <FAQAccordion items={[{ question: "Can a tight range still fail?", answer: "Yes. Tight price action does not remove gap risk, liquidity changes, or broader market weakness." }]} />
        <RelatedLinks links={[{ href: "/breakouts", title: "Breakout Scanner", description: "See continuation-style rows." }, { href: "/pre-breakout", title: "Pre-Breakout", description: "Compare early bases and tighter pauses." }, { href: "/learn", title: "Learning Hub", description: "Continue your pattern study." }, { href: "/how-we-scan-stocks", title: "Methodology", description: "Read scanner philosophy and update cadence." }]} />
      </section>
    </main>
  );
}
