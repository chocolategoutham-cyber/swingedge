import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";

export const metadata: Metadata = {
  title: "VCP Pattern Guide",
  description: "Educational guide to VCP-style contraction patterns and how the scanner recognizes similar behavior.",
};

export default function VcpPage() {
  return (
    <main>
      <PageHero eyebrow="Pattern guide" title="VCP Pattern Guide" subtitle="Understand how analysts describe volatility contraction patterns, pivot zones, and failure risk." />
      <section className="container py-8"><ImportantDisclaimer /></section>
      <section className="container space-y-8 pb-10">
        <div className="panel"><h2 className="text-2xl font-semibold text-white">What VCP means</h2><p className="mt-4 text-sm leading-7 text-slate-300">VCP is shorthand for a sequence of shrinking pullbacks and calmer ranges near a reference pivot. The platform looks for VCP-like behavior, not textbook perfection.</p></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel"><h3 className="text-xl font-semibold text-white">Hallmarks</h3><p className="mt-3 text-sm leading-7 text-slate-300">Three to five contractions, smaller pullbacks, falling volume, a visible pivot zone, and broader Stage 2 trend context.</p></div>
        <div className="panel"><h3 className="text-xl font-semibold text-white">Scanner logic</h3><p className="mt-3 text-sm leading-7 text-slate-300">SignalLens checks range width, pivot proximity, volume behavior, moving-average alignment, and failure-risk boundaries to tag VCP-like compression.</p></div>
        </div>
        <div className="panel"><h3 className="text-xl font-semibold text-white">Why VCP setups fail</h3><p className="mt-3 text-sm leading-7 text-slate-300">False pivots, weak market breadth, overhead supply, news shocks, and poor volume behavior can all invalidate an otherwise clean-looking pattern.</p></div>
        <FAQAccordion items={[{ question: "Is every tight base a VCP?", answer: "No. Tightness alone is not enough. Trend context, contraction quality, and risk boundaries still matter." }]} />
        <RelatedLinks links={[{ href: "/pre-breakout", title: "Pre-Breakout Scanner", description: "See VCP-like candidates in the live research table." }, { href: "/learn", title: "Learning Hub", description: "Continue with risk and trend basics." }, { href: "/how-we-scan-stocks", title: "Methodology", description: "Review platform vocabulary and update frequency." }, { href: "/proof-board", title: "Proof Board", description: "Audit how similar setups evolve." }]} />
      </section>
    </main>
  );
}
