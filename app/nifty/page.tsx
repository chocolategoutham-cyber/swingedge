import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import KpiCard from "@/components/common/KpiCard";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import NiftySignalGauge from "@/components/nifty/NiftySignalGauge";
import OpenInterestTable from "@/components/nifty/OpenInterestTable";
import { getNifty } from "@/lib/api";

export const metadata: Metadata = {
  title: "Nifty Market Context - Breadth, Trend and OI",
  description: "Nifty trend, breadth, momentum, VWAP, and open-interest context for scanner research.",
};

export default async function NiftyPage() {
  const context = await getNifty();
  const score = context.score;
  const label = context.label;

  return (
    <main>
      <PageHero
        eyebrow="Index context"
        title="Nifty Market Context"
        subtitle="Track index regime, breadth, intraday position versus VWAP, and option-interest support/resistance zones."
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container grid gap-6 pb-10 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <NiftySignalGauge score={score} label={label} />
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard label="Trend score" value={context.trendScore} />
            <KpiCard label="Breadth score" value={context.breadthScore} />
            <KpiCard label="Momentum score" value={context.momentumScore} />
            <KpiCard label="Volatility score" value={context.volatilityScore} />
            <KpiCard label="VWAP state" value={context.vwapState} />
            <KpiCard label="Last updated" value={new Date(context.dateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
          </div>
        </div>
        <div className="panel">
          <h2 className="text-xl font-semibold text-white">5-minute context chart</h2>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950 p-4">
            <svg viewBox="0 0 520 220" className="w-full">
              <rect width="520" height="220" rx="18" fill="#08111d" />
              {context.intraday.map((point, index) => {
                const x = 20 + index * 16;
                const y = 190 - (point.close - 22370) * 1.8;
                const vwapY = 190 - (point.vwap - 22370) * 1.8;
                return (
                  <g key={point.time}>
                    {index > 0 ? (
                      <>
                        <line
                          x1={20 + (index - 1) * 16}
                          y1={190 - (context.intraday[index - 1].close - 22370) * 1.8}
                          x2={x}
                          y2={y}
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        <line
                          x1={20 + (index - 1) * 16}
                          y1={190 - (context.intraday[index - 1].vwap - 22370) * 1.8}
                          x2={x}
                          y2={vwapY}
                          stroke="#f59e0b"
                          strokeWidth="1.5"
                        />
                      </>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Today&apos;s market environment is {label.toLowerCase()}. Breadth is {context.breadthRatio > 1 ? "supportive" : "mixed"}, volatility is controlled, and sector leadership remains selective.
          </p>
        </div>
      </section>
      <section className="container pb-10">
        <OpenInterestTable zones={context.supportResistanceZones} />
      </section>
      <section className="container pb-10">
        <div className="panel space-y-4 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-semibold text-white">How to use this page</h2>
          <p>Use Nifty context to understand the environment surrounding scanner rows. Positive breadth can support constructive setups, while caution or negative index context can increase failure risk.</p>
          <p>Avoid treating index context as standalone advice. It is one input in a larger research process.</p>
        </div>
      </section>
    </main>
  );
}
