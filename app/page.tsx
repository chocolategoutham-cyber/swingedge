import type { Metadata } from "next";
import Link from "next/link";
import KpiCard from "@/components/common/KpiCard";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";
import { mockStocks } from "@/lib/data/mock-stocks";
import {
  mockBreakdownSignals,
  mockBreakoutSignals,
  mockMomentumSignals,
  mockPreBreakoutSignals,
} from "@/lib/data/mock-scanner-runs";
import { mockNiftyContext } from "@/lib/data/mock-nifty";
import { mockMarketInsights } from "@/lib/data/mock-market-insights";

export const metadata: Metadata = {
  title: "SignalLens - NSE Swing Research Dashboard",
  description: "NSE swing research, scanners, market breadth, and proof tracking in one educational workspace.",
};

export default function HomePage() {
  const snapshot = mockPreBreakoutSignals.slice(0, 5);

  return (
    <main>
      <PageHero
        eyebrow="Home"
        title="NSE swing research, scanners, and market context in one workspace"
        subtitle="SignalLens is an original research dashboard for Indian equity swing traders. Explore constructive bases, momentum breakouts, bearish structure, proof-board transparency, and market breadth context without brokerage or execution features."
        metrics={
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard label="Universe scanned" value={mockStocks.length} />
            <KpiCard label="Latest scan time" value="15:42 IST" />
            <KpiCard label="Active candidates" value={mockPreBreakoutSignals.length + mockBreakoutSignals.length} tone="positive" />
            <KpiCard label="Market regime" value={mockNiftyContext.label} tone="warning" />
            <KpiCard label="Breadth score" value={mockNiftyContext.breadthScore} />
          </div>
        }
      />

      <section className="container py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["/pre-breakout", "Pre-Breakout", "Find bases, compression, and improving relative strength before confirmation."],
            ["/breakouts", "Breakouts", "Track confirmed expansion, continuation, and HTF-style momentum."],
            ["/breakdowns", "Breakdown Risk", "Review downside structure, support loss, and distribution context."],
            ["/proof-board", "Proof Board", "Audit historical outcomes across wins, failures, open records, and expiries."],
            ["/nifty", "Nifty Context", "Pair stock-level ideas with index regime, breadth, VWAP, and OI zones."],
            ["/insights", "Insights", "Monitor sector rotation, breadth, and leadership changes across NSE sectors."],
          ].map(([href, title, description]) => (
            <Link key={href} href={href} className="panel transition hover:border-cyan-400/30 hover:bg-white/10">
              <p className="text-lg font-semibold text-white">{title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="container py-10">
          <h2 className="text-2xl font-semibold text-white">What the platform does</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Finds pre-breakout bases, compression, and pivot proximity.",
              "Tracks confirmed breakouts and continuation behavior.",
              "Flags bearish structure and breakdown risk context.",
              "Shows market breadth, sector rotation, and relative-strength leadership.",
              "Tracks scanner outcomes in a transparent proof board.",
              "Provides pattern guides, methodology notes, and risk education.",
            ].map((item) => (
              <div key={item} className="panel text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10">
        <ImportantDisclaimer />
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          <KpiCard label="Breakout candidates" value={mockBreakoutSignals.length} tone="positive" />
          <KpiCard label="Bearish flags" value={mockBreakdownSignals.length} tone="risk" />
          <KpiCard label="Momentum leaders" value={mockMomentumSignals.length} />
          <KpiCard label="A/D ratio" value={mockMarketInsights.advanceDeclineRatio.toFixed(2)} />
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="panel">
            <h2 className="text-2xl font-semibold text-white">Recent scanner snapshot</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    {["Symbol", "Company", "Score", "Signal", "From Pivot", "RS Rank"].map((label) => (
                      <th key={label} className="px-3 py-3 text-left font-medium">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snapshot.map((row) => (
                    <tr key={row.id} className="border-b border-white/5">
                      <td className="px-3 py-3 text-white">{row.symbol}</td>
                      <td className="px-3 py-3 text-slate-300">{row.companyName}</td>
                      <td className="px-3 py-3 text-slate-200">{row.score}</td>
                      <td className="px-3 py-3 text-slate-200">{row.signalLabel}</td>
                      <td className="px-3 py-3 text-slate-200">{String(row.metrics.fromPivot ?? "NA")}</td>
                      <td className="px-3 py-3 text-slate-200">{String(row.metrics.rsRank ?? "NA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              This is educational research software only. It is not investment advice, trading advice, financial advice, or a recommendation to buy, sell, hold, short, hedge, or transact in any security.
            </p>
          </div>
          <div className="space-y-6">
            <div className="panel">
              <h3 className="text-lg font-semibold text-white">Research only</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use scanner output as model context. Review chart structure,
                market regime, liquidity, and risk boundaries before relying on
                any signal in your own research workflow.
              </p>
            </div>
            <div className="panel">
              <h3 className="text-lg font-semibold text-white">Educational links</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <Link href="/learn" className="block hover:text-white">Learning Hub</Link>
                <Link href="/patterns/vcp" className="block hover:text-white">VCP Pattern Guide</Link>
                <Link href="/patterns/high-tight-flag" className="block hover:text-white">High Tight Flag Guide</Link>
                <Link href="/how-we-scan-stocks" className="block hover:text-white">How We Scan Stocks</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <h2 className="text-2xl font-semibold text-white">Feature grid</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Filterable scanner tables",
            "Stock-level analysis drawers",
            "Proof board outcome math",
            "Nifty regime scoring",
            "Sector rotation heatmap",
            "Momentum leader board",
            "Pattern learning hub",
            "Risk and legal pages",
          ].map((feature) => (
            <div key={feature} className="panel text-sm text-slate-300">{feature}</div>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <h2 className="text-2xl font-semibold text-white">FAQ</h2>
        <div className="mt-6">
          <FAQAccordion
            items={[
              { question: "Is this investment advice?", answer: "No. SignalLens is educational research software only and does not create buy, sell, or hold recommendations." },
              { question: "Does it connect to a broker?", answer: "No. There is no brokerage integration, order placement, or execution workflow." },
              { question: "Are the first-version numbers real?", answer: "The first version uses local mock data so the product can be explored without a live vendor dependency." },
              { question: "Why show winners and failures together?", answer: "The proof board is designed to show positive, negative, expired, and open outcomes so model context remains transparent." },
            ]}
          />
        </div>
      </section>

      <section className="container py-10">
        <h2 className="text-2xl font-semibold text-white">Related pages</h2>
        <div className="mt-6">
          <RelatedLinks
            links={[
              { href: "/pre-breakout", title: "Pre-Breakout Scanner", description: "Compression, pivot proximity, and volume dry-up research." },
              { href: "/proof-board", title: "Proof Board", description: "Outcome tracking with open, closed, and invalidated records." },
              { href: "/nifty", title: "Nifty Context", description: "Index regime, breadth, and option-interest zones." },
              { href: "/learn", title: "Learning Hub", description: "Patterns, methodology, and risk basics." },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
