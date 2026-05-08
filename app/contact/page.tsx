import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";

export const metadata: Metadata = {
  title: "Contact SignalLens",
  description: "Contact route for bugs, data issues, compliance, and general questions.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="Contact" subtitle="Use this route for bug reports, data issues, compliance notes, general questions, or partnership inquiries." />
      <section className="container py-8 space-y-6">
        <ImportantDisclaimer />
        <div className="panel">
          <form className="grid gap-4 md:grid-cols-2">
            {["Name", "Email", "Subject"].map((label) => (
              <label key={label} className="text-sm text-slate-300">
                {label}
                <input className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white" />
              </label>
            ))}
            <label className="text-sm text-slate-300">
              Category
              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white">
                {["Bug", "Data issue", "General", "Partnership", "Compliance"].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="md:col-span-2 text-sm text-slate-300">
              Message
              <textarea rows={6} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white" />
            </label>
            <button type="button" className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 md:col-span-2">Send message</button>
          </form>
        </div>
        <div className="panel text-sm leading-7 text-slate-300">
          <p>Support email: support@signallens.example</p>
          <p className="mt-2">Data issue reports should include symbol, route, timestamp, and the specific discrepancy observed.</p>
          <p className="mt-2">Support cannot provide stock advice or personalized trade guidance.</p>
        </div>
      </section>
    </main>
  );
}
