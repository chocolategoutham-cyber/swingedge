import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import KpiCard from "@/components/common/KpiCard";
import CandlestickChart from "@/components/charts/CandlestickChart";
import StockDetailTabs from "@/components/stocks/StockDetailTabs";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import {
  mockBreakdownSignals,
  mockBreakoutSignals,
  mockMomentumSignals,
  mockPreBreakoutSignals,
} from "@/lib/data/mock-scanner-runs";
import { mockProofRecords } from "@/lib/data/mock-proof-records";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol} - Stock Research Detail`,
    description: `Scanner appearances, chart context, indicators, and proof history for ${symbol}.`,
  };
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const stock = mockStocks.find((candidate) => candidate.symbol === symbol);
  if (!stock) notFound();

  const signals = [
    ...mockPreBreakoutSignals,
    ...mockBreakoutSignals,
    ...mockBreakdownSignals,
    ...mockMomentumSignals,
  ].filter((signal) => signal.symbol === symbol);
  const proof = mockProofRecords.filter((record) => record.symbol === symbol);
  const candles = getCandles(symbol);
  const latest = candles[candles.length - 1];
  const firstSignal = signals[0];

  return (
    <main>
      <PageHero
        eyebrow="Stock detail"
        title={`${symbol} Research Detail`}
        subtitle={`${stock.companyName} in ${stock.sector}. Review chart context, scanner appearances, and proof history in one place.`}
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>
      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Sector" value={stock.sector} />
          <KpiCard label="Market cap bucket" value={stock.marketCapBucket} />
          <KpiCard label="Latest price" value={latest.close.toFixed(2)} />
          <KpiCard label="Last updated" value={latest.date} />
        </div>
      </section>
      <section className="container grid gap-6 pb-10 xl:grid-cols-[1.25fr_0.75fr]">
        <CandlestickChart
          candles={candles}
          pivot={firstSignal?.pivot}
          support={firstSignal?.support}
          target1={firstSignal?.target1}
          target2={firstSignal?.target2}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <KpiCard label="RSI" value={String(firstSignal?.metrics.rsi ?? "NA")} />
          <KpiCard label="ADX" value={String(firstSignal?.metrics.adx ?? "NA")} />
          <KpiCard label="RS Rank" value={String(firstSignal?.metrics.rsRank ?? "NA")} />
          <KpiCard label="Volume ratio" value={String(firstSignal?.metrics.volumeRatio ?? firstSignal?.metrics.volumeQuality ?? "NA")} />
          <KpiCard label="ATR" value={String(firstSignal?.metrics.atr ?? "NA")} />
          <KpiCard label="Distance from pivot" value={String(firstSignal?.metrics.fromPivot ?? "NA")} />
        </div>
      </section>
      <section className="container pb-10">
        <StockDetailTabs symbol={symbol} signals={signals} proof={proof} />
      </section>
      <section className="container pb-10">
        <p className="text-sm leading-7 text-slate-400">
          This symbol page is educational research software only. It is not investment advice, trading advice, financial advice, or a recommendation to buy, sell, hold, short, hedge, or transact in any security.
        </p>
      </section>
    </main>
  );
}
