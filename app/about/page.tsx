import type { Metadata } from "next";
import LegalPageLayout from "@/components/common/LegalPageLayout";

export const metadata: Metadata = {
  title: "About SignalLens",
  description: "Platform mission, transparency principles, and responsible research philosophy.",
};

export default function AboutPage() {
  return (
    <LegalPageLayout
      title="About SignalLens"
      intro="SignalLens is an original NSE-focused swing-trading research platform designed to organize scanners, market context, and educational guides in one workspace."
    >
      <section>
        <h2 className="text-2xl font-semibold text-white">Mission</h2>
        <p className="mt-3">The mission is to make swing-trading research easier to review, compare, and document without turning the platform into an advisory or brokerage product.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white">What the platform is</h2>
        <p className="mt-3">It is a research dashboard with scanners, market breadth context, proof tracking, and educational pattern guides.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white">What the platform is not</h2>
        <p className="mt-3">It is not a broker, execution system, advisory service, or source of buy/sell/hold recommendations.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white">Data transparency principles</h2>
        <p className="mt-3">SignalLens shows rule summaries, timestamps, and outcome states so users can understand what the model saw and how historical mock outcomes evolved.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white">No-advice policy</h2>
        <p className="mt-3">Everything on the platform is presented as research candidate context only.</p>
      </section>
    </LegalPageLayout>
  );
}
