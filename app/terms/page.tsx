import type { Metadata } from "next";
import LegalPageLayout from "@/components/common/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the SignalLens educational research platform.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Use" intro="These terms govern use of the SignalLens demo platform and clarify the limits of the service.">
      <section><h2 className="text-2xl font-semibold text-white">Educational and research use only</h2><p className="mt-3">SignalLens is provided for educational and research-oriented review. It does not create an advisory relationship.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">No advisory relationship</h2><p className="mt-3">Using the platform does not create a financial-advisor, broker, or fiduciary relationship.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">No execution services</h2><p className="mt-3">The platform does not provide brokerage, order placement, portfolio management, or payment features.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">User responsibility</h2><p className="mt-3">Users remain solely responsible for their decisions, research process, and any actions taken after viewing the site.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">No warranties and limited liability</h2><p className="mt-3">Data may be delayed, incomplete, inaccurate, or synthetic in demo mode. The service is provided without warranties to the fullest extent permitted by law.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Prohibited use and changes</h2><p className="mt-3">Users may not misuse the service, scrape it in violation of the terms, or misrepresent scanner output as financial advice. The platform may change features, routes, or data models at any time.</p></section>
    </LegalPageLayout>
  );
}
