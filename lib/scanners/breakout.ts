import { scannerSignalSchema, type EvidenceRule, type ScannerSignal } from "@/lib/types";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { scannerThresholds } from "@/lib/config/scanner-thresholds";
import {
  calculateADX,
  calculateRSI,
  calculateRelativeStrengthRank,
  calculateVolumeRatio,
  percentReturn,
} from "@/lib/scanners/indicators";
import {
  calculateBaseQuality,
  detectHighTightFlag,
  detectMovingAverageStack,
  detectTightRangeContraction,
  findPivotHighs,
} from "@/lib/scanners/shared";

function breakoutEvidence(symbol: string, flags: Record<string, boolean>): EvidenceRule[] {
  return [
    { id: `${symbol}-close`, label: "Close beyond pivot", passed: flags.closeBeyondPivot, weight: 0.2, description: "The latest close is above the chosen pivot zone.", category: "structure" },
    { id: `${symbol}-vol`, label: "Volume confirmation", passed: flags.volume, weight: 0.2, description: "Breakout participation is stronger than the 50-day average.", category: "volume" },
    { id: `${symbol}-rs`, label: "Leading relative strength", passed: flags.rs, weight: 0.16, description: "Relative strength remains strong versus the benchmark universe.", category: "momentum" },
    { id: `${symbol}-trend`, label: "Trend continuation", passed: flags.trend, weight: 0.18, description: "Moving averages and price trend remain favorable.", category: "trend" },
    { id: `${symbol}-risk`, label: "Controlled extension", passed: flags.risk, weight: 0.14, description: "Extension from pivot remains reasonable for follow-through research.", category: "risk" },
    { id: `${symbol}-pattern`, label: "Pattern behavior", passed: flags.pattern, weight: 0.12, description: "The setup aligns with continuation or HTF-style behavior.", category: "structure" },
  ];
}

export function calculateBreakoutScore(parts: {
  baseQuality: number;
  volumeRatio: number;
  rsRank: number;
  momentumScore: number;
  riskScore: number;
}) {
  return Math.round(
    parts.baseQuality * 0.21 +
      Math.min(100, parts.volumeRatio * 32) * 0.23 +
      parts.rsRank * 0.2 +
      parts.momentumScore * 0.2 +
      parts.riskScore * 0.16
  );
}

export function scanBreakouts(universe = mockStocks) {
  const relativeReturnMap = Object.fromEntries(
    universe.map((stock) => {
      const candles = getCandles(stock.symbol);
      return [stock.symbol, percentReturn(candles[candles.length - 60].close, candles[candles.length - 1].close)];
    })
  );

  return universe
    .map((stock, index) => {
      const candles = getCandles(stock.symbol);
      const latest = candles[candles.length - 1];
      const pivots = findPivotHighs(candles);
      const pivot = pivots[pivots.length - 2] ?? latest.close * 0.94;
      const price = latest.close + (index % 2 === 0 ? 6 : 0);
      const volumeRatio = calculateVolumeRatio(candles, 30);
      const rsRank = calculateRelativeStrengthRank(relativeReturnMap, stock.symbol);
      const rsi = calculateRSI(candles.map((candle) => candle.close));
      const adx = calculateADX(candles);
      const trend = detectMovingAverageStack(candles);
      const baseQuality = calculateBaseQuality(candles);
      const from52wHigh = ((price - Math.max(...candles.map((candle) => candle.high))) / Math.max(...candles.map((candle) => candle.high))) * 100;
      const htf = detectHighTightFlag(candles);
      const continuation = detectTightRangeContraction(candles);
      const momentumScore = Math.min(100, rsi * 0.7 + adx);
      const riskScore = Math.max(30, 100 - Math.max(0, ((price - pivot) / pivot) * 100 - 9) * 4.2);
      const score = calculateBreakoutScore({
        baseQuality,
        volumeRatio,
        rsRank,
        momentumScore,
        riskScore,
      });

      if (score < scannerThresholds.breakout.moderate && index > 22) return null;

      return scannerSignalSchema.parse({
        id: `bo-${stock.symbol}`,
        symbol: stock.symbol,
        companyName: stock.companyName,
        scannerType: "breakout",
        setupType: htf ? "High Tight Flag" : continuation ? "Continuation" : "Fresh Breakout",
        signalDate: latest.date,
        score,
        signalLabel: score >= scannerThresholds.breakout.strong ? "Strong" : score >= 50 ? "Moderate" : "Weak",
        price: Number(price.toFixed(2)),
        pivot: Number(pivot.toFixed(2)),
        support: Number((pivot * 0.96).toFixed(2)),
        stopReference: Number((pivot * 0.955).toFixed(2)),
        target1: Number((pivot * 1.09).toFixed(2)),
        target2: Number((pivot * 1.17).toFixed(2)),
        riskTier: riskScore < 48 ? "High" : riskScore < 62 ? "Moderate" : "Low",
        marketCapBucket: stock.marketCapBucket,
        sector: stock.sector,
        evidenceRules: breakoutEvidence(stock.symbol, {
          closeBeyondPivot: price > pivot,
          volume: volumeRatio >= scannerThresholds.breakout.volumeRatioMin,
          rs: rsRank > 65,
          trend: trend !== "bearish",
          risk: riskScore > 54,
          pattern: htf || continuation,
        }),
        metrics: {
          rsRank,
          baseQuality: Number(baseQuality.toFixed(1)),
          volumeRatio: Number(volumeRatio.toFixed(2)),
          volumeQuality: Number(Math.min(100, volumeRatio * 30).toFixed(1)),
          rsi: Number(rsi.toFixed(1)),
          adx: Number(adx.toFixed(1)),
          gainSinceAppeared: Number(percentReturn(candles[candles.length - 15].close, price).toFixed(1)),
          gain10d: Number(percentReturn(candles[candles.length - 10].close, price).toFixed(1)),
          gain20d: Number(percentReturn(candles[candles.length - 20].close, price).toFixed(1)),
          from52wHigh: Number(from52wHigh.toFixed(1)),
          htf,
          continuation,
          freshBreakout: !htf && !continuation,
          activeBreakout: price > pivot * 1.02,
          leadingRs: rsRank > 80,
          lowRisk: riskScore > 68,
          highAccuracy: score > 79,
          volumeConfirmed: volumeRatio >= 1.6,
        },
        notes:
          "Breakout scanner output is educational research only. Use price extension, volume confirmation, and risk boundaries as context rather than instructions.",
        updatedAt: new Date().toISOString(),
      });
    })
    .filter(Boolean) as ScannerSignal[];
}
