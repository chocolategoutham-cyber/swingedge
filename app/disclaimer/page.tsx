import type { Metadata } from "next";
import LegalPageLayout from "@/components/common/LegalPageLayout";

export const metadata: Metadata = {
  title: "Risk Disclaimer",
  description: "Strong financial risk disclosure for the SignalLens research platform.",
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Risk Disclaimer" intro="Please read this page carefully before relying on any scanner output, model context, or historical proof record.">
      <section><h2 className="text-2xl font-semibold text-white">Not investment advice</h2><p className="mt-3">Nothing on this platform is investment advice, financial advice, trading advice, or a recommendation to buy, sell, hold, short, hedge, or transact in any security.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Historical performance</h2><p className="mt-3">Historical outcomes do not guarantee future results. Scanner outputs can be wrong, incomplete, stale, or poorly timed.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Market risk</h2><p className="mt-3">Markets involve risk, including loss of principal, volatility shocks, gap risk, liquidity changes, and event-driven moves.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">User responsibility</h2><p className="mt-3">Each user remains responsible for evaluating suitability, risk tolerance, research quality, and the consequences of any decision.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Consult professionals</h2><p className="mt-3">If you need personalized advice, consult qualified professionals. This platform does not provide broker or order-execution functionality.</p></section>
    </LegalPageLayout>
  );
}
