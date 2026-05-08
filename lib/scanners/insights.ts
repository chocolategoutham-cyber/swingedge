import { mockMarketInsights } from "@/lib/data/mock-market-insights";
import { marketInsightsSchema, type MarketInsights, type SectorSnapshot, type Stock } from "@/lib/types";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { calculateRelativeStrengthRank, calculateSMA, percentReturn } from "@/lib/scanners/indicators";

export function calculateAdvanceDeclineRatio() {
  return mockMarketInsights.advanceDeclineRatio;
}

export function calculateMarketBreadth() {
  return {
    label: mockMarketInsights.breadthLabel,
    advancers: mockMarketInsights.advancers,
    decliners: mockMarketInsights.decliners,
    unchanged: mockMarketInsights.unchanged,
  };
}

export function classifySectorTrend(
  return1m: number,
  rsScore: number
): SectorSnapshot["trendState"] {
  if (return1m > 4 && rsScore > 75) return "Leading";
  if (return1m > 1 && rsScore > 60) return "Improving";
  if (return1m > -2 && rsScore > 45) return "Lagging";
  return "Weakening";
}

export function calculateSectorRotation(): SectorSnapshot[] {
  return mockMarketInsights.sectors.map((sector) => ({
    ...sector,
    trendState: classifySectorTrend(sector.return1m, sector.rsScore),
  }));
}

export function buildMarketInsightsFromUniverse(universe: Stock[] = mockStocks): MarketInsights {
  const symbolReturns = Object.fromEntries(
    universe.map((stock) => {
      const candles = getCandles(stock.symbol);
      return [stock.symbol, percentReturn(candles[candles.length - 63].close, candles[candles.length - 1].close)];
    })
  );

  const grouped = universe.reduce<Record<string, Stock[]>>((accumulator, stock) => {
    accumulator[stock.sector] = accumulator[stock.sector] || [];
    accumulator[stock.sector].push(stock);
    return accumulator;
  }, {});

  const sectors = Object.entries(grouped)
    .map(([sector, stocks]) => {
      const return1w = stocks.reduce((sum, stock) => {
        const candles = getCandles(stock.symbol);
        return sum + percentReturn(candles[candles.length - 6].close, candles[candles.length - 1].close);
      }, 0) / stocks.length;
      const return1m = stocks.reduce((sum, stock) => {
        const candles = getCandles(stock.symbol);
        return sum + percentReturn(candles[candles.length - 21].close, candles[candles.length - 1].close);
      }, 0) / stocks.length;
      const return3m = stocks.reduce((sum, stock) => {
        const candles = getCandles(stock.symbol);
        return sum + percentReturn(candles[candles.length - 63].close, candles[candles.length - 1].close);
      }, 0) / stocks.length;
      const rsScore = Math.round(
        stocks.reduce((sum, stock) => sum + calculateRelativeStrengthRank(symbolReturns, stock.symbol), 0) / stocks.length
      );
      const breadthScore = Math.round(
        (stocks.filter((stock) => {
          const candles = getCandles(stock.symbol);
          const closes = candles.map((candle) => candle.close);
          return closes[closes.length - 1] > calculateSMA(closes, 20);
        }).length / stocks.length) * 100
      );

      return {
        sector,
        return1w: Number(return1w.toFixed(1)),
        return1m: Number(return1m.toFixed(1)),
        return3m: Number(return3m.toFixed(1)),
        rsScore,
        trendState: classifySectorTrend(return1m, rsScore),
        breadthScore,
      };
    })
    .sort((left, right) => right.rsScore - left.rsScore);

  const advancers = universe.filter((stock) => {
    const candles = getCandles(stock.symbol);
    return candles[candles.length - 1].close > candles[candles.length - 2].close;
  }).length;
  const decliners = universe.filter((stock) => {
    const candles = getCandles(stock.symbol);
    return candles[candles.length - 1].close < candles[candles.length - 2].close;
  }).length;
  const unchanged = universe.length - advancers - decliners;

  const percentAbove = (period: number) =>
    Math.round(
      (universe.filter((stock) => {
        const closes = getCandles(stock.symbol).map((candle) => candle.close);
        return closes[closes.length - 1] > calculateSMA(closes, period);
      }).length /
        Math.max(universe.length, 1)) *
        100
    );

  const breadthRatio = advancers / Math.max(decliners, 1);
  const breadthLabel =
    breadthRatio > 1.5 ? "Strong" : breadthRatio > 1.05 ? "Mixed" : breadthRatio > 0.8 ? "Narrow" : "Weak";

  return marketInsightsSchema.parse({
    dateTime: new Date().toISOString(),
    marketPulse:
      breadthLabel === "Strong"
        ? "Constructive participation across eligible sleeves"
        : breadthLabel === "Weak"
          ? "Defensive tone with narrower participation"
          : "Selective participation with mixed sector rotation",
    breadthLabel,
    riskRegime:
      breadthLabel === "Strong" ? "Constructive but selective" : breadthLabel === "Weak" ? "Fragile" : "Rotation-led",
    newHighs: universe.filter((stock) => {
      const candles = getCandles(stock.symbol);
      return candles[candles.length - 1].high >= Math.max(...candles.slice(-60).map((candle) => candle.high));
    }).length,
    newLows: universe.filter((stock) => {
      const candles = getCandles(stock.symbol);
      return candles[candles.length - 1].low <= Math.min(...candles.slice(-60).map((candle) => candle.low));
    }).length,
    advancers,
    decliners,
    unchanged,
    advanceDeclineRatio: Number(breadthRatio.toFixed(2)),
    percentAbove20dma: percentAbove(20),
    percentAbove50dma: percentAbove(50),
    percentAbove200dma: percentAbove(100),
    sectors,
  });
}
