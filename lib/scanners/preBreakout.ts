import { scannerSignalSchema, type EvidenceRule, type ScannerSignal, type Stock } from "@/lib/types";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { scannerThresholds } from "@/lib/config/scanner-thresholds";
import {
  calculateADX,
  calculateATR,
  calculateRSI,
  calculateRelativeStrengthRank,
  calculateVolumeRatio,
  percentReturn,
} from "@/lib/scanners/indicators";
import {
  calculateBaseQuality,
  calculateBreakoutProximity,
  detectMovingAverageStack,
  detectVcpLikeCompression,
  detectVolumeDryUp,
  findPivotHighs,
} from "@/lib/scanners/shared";

function buildEvidence(stock: Stock, values: Record<string, boolean>): EvidenceRule[] {
  return [
    {
      id: `${stock.symbol}-trend`,
      label: "Trend alignment",
      passed: values.trend,
      weight: 0.18,
      description: "Moving averages and price structure remain constructive.",
      category: "trend",
    },
    {
      id: `${stock.symbol}-base`,
      label: "Constructive base",
      passed: values.base,
      weight: 0.22,
      description: "Range structure remains orderly with contained pullbacks.",
      category: "structure",
    },
    {
      id: `${stock.symbol}-dry-up`,
      label: "Volume dry-up",
      passed: values.volumeDryUp,
      weight: 0.15,
      description: "Activity is quieter inside the base than during prior expansion.",
      category: "volume",
    },
    {
      id: `${stock.symbol}-rs`,
      label: "Relative strength",
      passed: values.rs,
      weight: 0.18,
      description: "Relative performance remains competitive versus the benchmark set.",
      category: "momentum",
    },
    {
      id: `${stock.symbol}-risk`,
      label: "Contained failure risk",
      passed: values.risk,
      weight: 0.12,
      description: "Distance to the reference stop remains acceptable for research.",
      category: "risk",
    },
    {
      id: `${stock.symbol}-compression`,
      label: "VCP-like compression",
      passed: values.compression,
      weight: 0.15,
      description: "Recent swings are becoming tighter as the base matures.",
      category: "structure",
    },
  ];
}

export function calculatePreBreakoutScore(parts: {
  baseQuality: number;
  rsRank: number;
  volumeScore: number;
  trendScore: number;
  proximityScore: number;
  riskScore: number;
}) {
  return Math.round(
    parts.baseQuality * 0.25 +
      parts.rsRank * 0.18 +
      parts.volumeScore * 0.15 +
      parts.trendScore * 0.14 +
      parts.proximityScore * 0.16 +
      parts.riskScore * 0.12
  );
}

export function scanPreBreakouts() {
  const relativeReturnMap = Object.fromEntries(
    mockStocks.map((stock) => {
      const candles = getCandles(stock.symbol);
      return [
        stock.symbol,
        percentReturn(candles[candles.length - 30].close, candles[candles.length - 1].close),
      ];
    })
  );

  return mockStocks
    .map((stock, index) => {
      const candles = getCandles(stock.symbol);
      const closes = candles.map((candle) => candle.close);
      const latest = candles[candles.length - 1];
      const pivots = findPivotHighs(candles);
      const pivot = pivots[pivots.length - 1] ?? latest.close * 1.03;
      const support = Math.min(...candles.slice(-20).map((candle) => candle.low));
      const rsRank = calculateRelativeStrengthRank(relativeReturnMap, stock.symbol);
      const baseQuality = calculateBaseQuality(candles);
      const volumeDryUp = detectVolumeDryUp(candles);
      const proximity = calculateBreakoutProximity(latest.close, pivot);
      const trendState = detectMovingAverageStack(candles);
      const rsi = calculateRSI(closes);
      const adx = calculateADX(candles);
      const atr = calculateATR(candles);
      const compression = detectVcpLikeCompression(candles);
      const trendScore = trendState === "bullish" ? 84 : trendState === "mixed" ? 58 : 35;
      const proximityScore = Math.max(20, 100 - Math.abs(proximity) * 8);
      const riskScore = Math.max(22, 100 - ((latest.close - support) / latest.close) * 100 * 3.6);
      const score = calculatePreBreakoutScore({
        baseQuality,
        rsRank,
        volumeScore: volumeDryUp.score,
        trendScore,
        proximityScore,
        riskScore,
      });

      const signalLabel =
        score >= scannerThresholds.preBreakout.veryStrong
          ? "Very Strong"
          : score >= scannerThresholds.preBreakout.strong
            ? "Strong"
            : score >= scannerThresholds.preBreakout.watch
              ? "Watch"
              : "Weak";

      if (score < scannerThresholds.preBreakout.watch && index > 18) return null;

      return scannerSignalSchema.parse({
        id: `pre-${stock.symbol}`,
        symbol: stock.symbol,
        companyName: stock.companyName,
        scannerType: "pre-breakout",
        setupType: compression ? "VCP Compression" : "Base Range",
        signalDate: latest.date,
        score,
        signalLabel,
        price: latest.close,
        pivot: Number(pivot.toFixed(2)),
        support: Number(support.toFixed(2)),
        stopReference: Number((support * 0.985).toFixed(2)),
        target1: Number((pivot * 1.08).toFixed(2)),
        target2: Number((pivot * 1.16).toFixed(2)),
        riskTier: riskScore < 45 ? "High" : riskScore < 60 ? "Moderate" : "Low",
        marketCapBucket: stock.marketCapBucket,
        sector: stock.sector,
        evidenceRules: buildEvidence(stock, {
          trend: trendState !== "bearish",
          base: baseQuality > 56,
          volumeDryUp: volumeDryUp.isDrying,
          rs: rsRank > 60,
          risk: riskScore > 55,
          compression,
        }),
        metrics: {
          rsRank,
          baseQuality: Number(baseQuality.toFixed(1)),
          volumeQuality: Number(volumeDryUp.score.toFixed(1)),
          price: latest.close,
          fromPivot: Number(proximity.toFixed(1)),
          rsi: Number(rsi.toFixed(1)),
          adx: Number(adx.toFixed(1)),
          atr: Number(atr.toFixed(2)),
          stage: trendState === "bullish" ? "2" : "1-late",
          vcp: compression,
          volumeDryUp: volumeDryUp.isDrying,
          lowRisk: riskScore > 68,
          highAccuracy: score > 79,
          leadingRs: rsRank > 78,
          highBase: baseQuality > 74,
          volumeConfirmed: volumeDryUp.score > 65,
          updatedAt: latest.date,
        },
        notes:
          "Scanner output is educational model context only. Review the range, pivot, and risk boundary before using it in any research workflow.",
        updatedAt: new Date().toISOString(),
      });
    })
    .filter(Boolean) as ScannerSignal[];
}
