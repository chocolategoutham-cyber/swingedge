import type { Metadata } from "next";
import LegalPageLayout from "@/components/common/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the SignalLens demo platform.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" intro="This privacy policy explains the data categories, retention approach, and third-party tooling used by this demo platform.">
      <section><h2 className="text-2xl font-semibold text-white">Data collected</h2><p className="mt-3">The demo may collect standard analytics signals, device/browser information, and contact-form submissions where implemented.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Analytics data</h2><p className="mt-3">Aggregated usage analytics may be used to understand route usage, table interactions, and performance patterns.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Local watchlist storage</h2><p className="mt-3">If watchlist features are added, lightweight local browser storage may be used to preserve user preferences.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Cookies</h2><p className="mt-3">Cookies or similar storage may be used for functional preferences, analytics, and deployment tooling where applicable.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Contact form data</h2><p className="mt-3">Contact submissions may include name, email, subject, category, and message details so support inquiries can be reviewed.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Third-party services</h2><p className="mt-3">Hosting, analytics, email, and infrastructure vendors may process operational metadata to deliver the site.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Data retention and rights</h2><p className="mt-3">Retention periods depend on operational need, legal requirements, and vendor settings. Users may contact the platform to request corrections or deletion where feasible.</p></section>
      <section><h2 className="text-2xl font-semibold text-white">Contact</h2><p className="mt-3">Privacy questions may be sent to privacy@signallens.example.</p></section>
    </LegalPageLayout>
  );
}
