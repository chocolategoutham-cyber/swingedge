import { scannerSignalSchema, type EvidenceRule, type ScannerSignal } from "@/lib/types";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { calculateADX, calculateRSI, calculateRelativeStrengthRank, calculateVolumeRatio, percentReturn } from "@/lib/scanners/indicators";
import { detectMovingAverageStack } from "@/lib/scanners/shared";

function momentumEvidence(symbol: string, flags: Record<string, boolean>): EvidenceRule[] {
  return [
    { id: `${symbol}-returns`, label: "Sustained returns", passed: flags.returns, weight: 0.24, description: "Rolling returns remain stronger than benchmark and peers.", category: "momentum" },
    { id: `${symbol}-trend`, label: "Trend stage", passed: flags.trend, weight: 0.2, description: "Moving average alignment remains healthy.", category: "trend" },
    { id: `${symbol}-volume`, label: "Supportive volume trend", passed: flags.volume, weight: 0.16, description: "Volume behavior does not contradict the trend.", category: "volume" },
    { id: `${symbol}-rs`, label: "High relative strength rank", passed: flags.rs, weight: 0.22, description: "Relative strength remains near the top of the universe.", category: "momentum" },
    { id: `${symbol}-risk`, label: "Extension check", passed: flags.risk, weight: 0.18, description: "The symbol is not excessively extended for research tracking.", category: "risk" },
  ];
}

export function calculateMomentumScore(parts: {
  rsRank: number;
  return1m: number;
  return3m: number;
  trendScore: number;
  volumeScore: number;
  riskScore: number;
}) {
  return Math.round(
    parts.rsRank * 0.24 +
      Math.min(100, parts.return1m * 4 + 50) * 0.16 +
      Math.min(100, parts.return3m * 2 + 50) * 0.2 +
      parts.trendScore * 0.18 +
      parts.volumeScore * 0.1 +
      parts.riskScore * 0.12
  );
}

export function scanMomentumLeaders(universe = mockStocks) {
  const relativeReturnMap = Object.fromEntries(
    universe.map((stock) => {
      const candles = getCandles(stock.symbol);
      return [stock.symbol, percentReturn(candles[candles.length - 60].close, candles[candles.length - 1].close)];
    })
  );

  return universe
    .map((stock) => {
      const candles = getCandles(stock.symbol);
      const latest = candles[candles.length - 1];
      const return1m = percentReturn(candles[candles.length - 21].close, latest.close);
      const return3m = percentReturn(candles[candles.length - 63].close, latest.close);
      const return6m = percentReturn(candles[0].close, latest.close);
      const rsRank = calculateRelativeStrengthRank(relativeReturnMap, stock.symbol);
      const trend = detectMovingAverageStack(candles);
      const volumeRatio = calculateVolumeRatio(candles);
      const rsi = calculateRSI(candles.map((candle) => candle.close));
      const adx = calculateADX(candles);
      const riskScore = Math.max(28, 100 - Math.max(0, return1m - 18) * 3.2);
      const score = calculateMomentumScore({
        rsRank,
        return1m,
        return3m,
        trendScore: trend === "bullish" ? 84 : trend === "mixed" ? 62 : 40,
        volumeScore: Math.min(100, volumeRatio * 30),
        riskScore,
      });

      return scannerSignalSchema.parse({
        id: `mom-${stock.symbol}`,
        symbol: stock.symbol,
        companyName: stock.companyName,
        scannerType: "momentum",
        setupType: "Relative Strength Leader",
        signalDate: latest.date,
        score,
        signalLabel: score >= 80 ? "Very Strong" : score >= 65 ? "Strong" : score >= 50 ? "Moderate" : "Weak",
        price: latest.close,
        stopReference: Number((latest.close * 0.92).toFixed(2)),
        target1: Number((latest.close * 1.08).toFixed(2)),
        target2: Number((latest.close * 1.14).toFixed(2)),
        riskTier: riskScore < 48 ? "High" : riskScore < 62 ? "Moderate" : "Low",
        marketCapBucket: stock.marketCapBucket,
        sector: stock.sector,
        evidenceRules: momentumEvidence(stock.symbol, {
          returns: return3m > 5,
          trend: trend === "bullish",
          volume: volumeRatio > 0.85,
          rs: rsRank > 70,
          risk: riskScore > 55,
        }),
        metrics: {
          rsRank,
          return1m: Number(return1m.toFixed(1)),
          return3m: Number(return3m.toFixed(1)),
          return6m: Number(return6m.toFixed(1)),
          trendStage: trend === "bullish" ? "Stage 2" : trend === "mixed" ? "Stage 1" : "Stage 4",
          volumeTrend: volumeRatio > 1.1 ? "expanding" : volumeRatio > 0.9 ? "steady" : "contracting",
          riskLabel: riskScore < 48 ? "Extended" : riskScore < 62 ? "Moderate" : "Contained",
          rsi: Number(rsi.toFixed(1)),
          adx: Number(adx.toFixed(1)),
        },
        notes:
          "Momentum page content is educational and descriptive. Sustained leadership can still reverse quickly in volatile conditions.",
        updatedAt: new Date().toISOString(),
      });
    })
    .sort((left, right) => (right.metrics.rsRank as number) - (left.metrics.rsRank as number))
    .slice(0, 24);
}
