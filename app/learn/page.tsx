import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import RelatedLinks from "@/components/common/RelatedLinks";

export const metadata: Metadata = {
  title: "Learn Swing Trading Research - Patterns and Risk",
  description: "Central learning hub for patterns, methodology, risk basics, and responsible scanner use.",
};

export default function LearnPage() {
  const guides = [
    "VCP pattern",
    "High Tight Flag",
    "Tight Range Contraction",
    "Stage 2 trend",
    "Relative Strength",
    "Risk/Reward",
    "Volume Confirmation",
  ];

  return (
    <main>
      <PageHero
        eyebrow="Learn"
        title="Learn Swing Trading Research"
        subtitle="Explore patterns, methodology, risk basics, breadth concepts, and responsible scanner interpretation."
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container grid gap-4 pb-10 md:grid-cols-2 xl:grid-cols-3">
        {["Patterns", "Scanner Methodology", "Risk Management", "Market Breadth", "Relative Strength", "Breakouts and Failed Breakouts"].map((category) => (
          <div key={category} className="panel">
            <h2 className="text-lg font-semibold text-white">{category}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Educational explanations and platform vocabulary to help users read scanner output responsibly.</p>
          </div>
        ))}
      </section>
      <section className="container pb-10">
        <div className="panel">
          <h2 className="text-2xl font-semibold text-white">Featured guides</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <div key={guide} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-medium text-white">{guide}</p>
                <p className="mt-2 text-sm text-slate-400">Original educational content for research workflows, not trading instructions.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container pb-10">
        <div className="panel">
          <h2 className="text-2xl font-semibold text-white">Beginner pathway</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>1. Learn market structure.</p>
            <p>2. Learn trend context.</p>
            <p>3. Learn volume behavior.</p>
            <p>4. Learn scanner interpretation.</p>
            <p>5. Learn risk boundaries.</p>
          </div>
        </div>
      </section>
      <section className="container pb-10">
        <RelatedLinks
          links={[
            { href: "/patterns/vcp", title: "VCP", description: "Contraction-led base behavior." },
            { href: "/patterns/high-tight-flag", title: "High Tight Flag", description: "Momentum continuation with volatility disclosure." },
            { href: "/patterns/tight-range-contraction", title: "Tight Range Contraction", description: "Sideways continuation behavior." },
            { href: "/how-we-scan-stocks", title: "How We Scan Stocks", description: "Platform philosophy and risk boundaries." },
          ]}
        />
      </section>
    </main>
  );
}
