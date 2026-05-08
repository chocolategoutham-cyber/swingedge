import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { scannerThresholds } from "@/lib/config/scanner-thresholds";
import {
  marketUniverseProfileSchema,
  methodologyOverviewSchema,
  type MarketUniverseProfile,
  type Stock,
  type UniverseSleeve,
} from "@/lib/types";

function resolveSleeve(stock: Stock): UniverseSleeve {
  if (stock.marketCapBucket === "Large-Mid") return "Nifty 500";
  if (stock.marketCapBucket === "Small Cap") return "Nifty SmallCap 250";
  return "Nifty MicroCap 250";
}

function averageDailyValue20(stock: Stock) {
  const candles = getCandles(stock.symbol).slice(-20);
  return candles.reduce((sum, candle) => sum + candle.close * candle.volume, 0) / Math.max(candles.length, 1);
}

function averageVolume20(stock: Stock) {
  const candles = getCandles(stock.symbol).slice(-20);
  return candles.reduce((sum, candle) => sum + candle.volume, 0) / Math.max(candles.length, 1);
}

function staleSessions20(stock: Stock) {
  const candles = getCandles(stock.symbol).slice(-20);
  const averageVolume = averageVolume20(stock);

  return candles.reduce((count, candle, index) => {
    if (index === 0) return count;
    const previous = candles[index - 1];
    const isFlat = Math.abs(candle.close - previous.close) <= Math.max(previous.close * 0.0008, 0.08);
    const isThin = candle.volume < averageVolume * 0.55;
    return count + Number(isFlat && isThin);
  }, 0);
}

function participationScore(stock: Stock) {
  const sleeve = resolveSleeve(stock);
  const adv = averageDailyValue20(stock);
  const averageVolume = averageVolume20(stock);
  const stale = staleSessions20(stock);
  const requiredAdv = scannerThresholds.universe.minAverageDailyValue20[sleeve];
  const advScore = Math.min(100, (adv / requiredAdv) * 65);
  const volumeScore = Math.min(100, averageVolume / 50000);
  const freshnessPenalty = stale * 9;
  return Math.max(5, Math.min(100, advScore * 0.8 + volumeScore * 0.2 - freshnessPenalty));
}

export function buildMarketUniverseProfiles(stocks = mockStocks): MarketUniverseProfile[] {
  return stocks.map((stock) => {
    const sleeve = resolveSleeve(stock);
    const averageDailyTradedValue20 = averageDailyValue20(stock);
    const averageVolume20d = averageVolume20(stock);
    const staleSessions20d = staleSessions20(stock);
    const participation = participationScore(stock);
    const passesLiquidity =
      averageDailyTradedValue20 >= scannerThresholds.universe.minAverageDailyValue20[sleeve] &&
      participation >= scannerThresholds.universe.minParticipationScore;
    const passesFreshness = staleSessions20d <= scannerThresholds.universe.maxStaleSessions20d;
    const isEligible = passesLiquidity && passesFreshness;

    return marketUniverseProfileSchema.parse({
      symbol: stock.symbol,
      companyName: stock.companyName,
      sleeve,
      averageDailyTradedValue20: Number(averageDailyTradedValue20.toFixed(0)),
      averageVolume20d: Number(averageVolume20d.toFixed(0)),
      staleSessions20d,
      participationScore: Number(participation.toFixed(1)),
      liquidityScore: Number(Math.min(100, participation + (passesFreshness ? 8 : -10)).toFixed(1)),
      passesLiquidity,
      passesFreshness,
      isEligible,
      exclusionReason: isEligible
        ? null
        : passesLiquidity
          ? "Freshness gate failed due to stale/thin recent sessions."
          : "Liquidity-aware participation filter rejected the symbol.",
    });
  });
}

export function getEligibleStocks(stocks = mockStocks) {
  const profiles = buildMarketUniverseProfiles(stocks);
  const allowedSymbols = new Set(profiles.filter((profile) => profile.isEligible).map((profile) => profile.symbol));
  return stocks.filter((stock) => allowedSymbols.has(stock.symbol));
}

export function buildMethodologyOverview() {
  return methodologyOverviewSchema.parse({
    universe: {
      venue: "NSE",
      sleeves: ["Nifty 500", "Nifty SmallCap 250", "Nifty MicroCap 250"],
      notes: [
        "Universe membership is modeled through NSE sleeve-style buckets in the first version.",
        "Liquidity-aware participation filters exclude stale or chronically thin symbols.",
        "Coverage is not F&O-only and remains research-oriented rather than execution-oriented.",
      ],
    },
    principles: [
      "Research candidates, not calls.",
      "Multiple clues, not one indicator.",
      "Exact formulas, combinations, and tie-break rules stay configurable and private.",
    ],
    scannerVocabulary: [
      "Consolidation",
      "VCP-like compression",
      "Relative strength",
      "Breakout proximity",
      "Volume-price behavior",
      "Trend alignment",
      "Failure risk",
      "Bearish setup",
      "Proof board",
    ],
    updateCadence: [
      "Core scanner pages refresh after market-close style jobs.",
      "Context pages can update more frequently when supporting data is available.",
      "Proof records are refreshed from scanner appearances and subsequent outcome rules.",
    ],
    disclaimer:
      "This backend mirrors the public methodology language and boundaries, not any private proprietary ranking formula.",
  });
}
