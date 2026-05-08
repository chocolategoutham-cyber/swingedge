import type { ReactNode } from "react";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";

export default function LegalPageLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-slate-950">
      <section className="border-b border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h1 className="text-4xl font-semibold text-white">{title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">{intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ImportantDisclaimer />
        <div className="mt-8 space-y-5 text-slate-300">
          {children}
        </div>
      </section>
    </main>
  );
}
