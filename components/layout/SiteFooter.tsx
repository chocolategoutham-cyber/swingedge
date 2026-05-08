import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">SignalLens</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              NSE swing-research workspace with scanners, breadth context,
              learning guides, and transparent outcome tracking.
            </p>
          </div>
          <div>
            <p className="font-medium text-white">Company</p>
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <Link href="/about" className="block hover:text-white">About</Link>
              <Link href="/how-we-scan-stocks" className="block hover:text-white">How We Scan</Link>
              <Link href="/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <p className="font-medium text-white">Research</p>
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <Link href="/pre-breakout" className="block hover:text-white">Pre-Breakout</Link>
              <Link href="/breakouts" className="block hover:text-white">Breakouts</Link>
              <Link href="/breakdowns" className="block hover:text-white">Breakdown Risk</Link>
              <Link href="/proof-board" className="block hover:text-white">Proof Board</Link>
            </div>
          </div>
          <div>
            <p className="font-medium text-white">Legal</p>
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <Link href="/privacy" className="block hover:text-white">Privacy</Link>
              <Link href="/terms" className="block hover:text-white">Terms</Link>
              <Link href="/disclaimer" className="block hover:text-white">Risk Disclaimer</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-400">
          Important disclaimer: This platform is educational research software only.
          It is not investment advice, trading advice, financial advice, or a
          recommendation to buy, sell, hold, short, hedge, or transact in any
          security.
        </div>
      </div>
    </footer>
  );
}
