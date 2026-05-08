import { scannerSignalSchema, type EvidenceRule, type ScannerSignal } from "@/lib/types";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { scannerThresholds } from "@/lib/config/scanner-thresholds";
import { calculateRSI, calculateRelativeStrengthRank, calculateVolumeRatio, percentReturn } from "@/lib/scanners/indicators";
import {
  detectDistributionDays,
  detectMovingAverageStack,
  detectSupportLoss,
  findPivotLows,
} from "@/lib/scanners/shared";

function breakdownEvidence(symbol: string, flags: Record<string, boolean>): EvidenceRule[] {
  return [
    { id: `${symbol}-support`, label: "Support loss", passed: flags.supportLoss, weight: 0.24, description: "Price closed meaningfully below a recent support area.", category: "structure" },
    { id: `${symbol}-dma`, label: "Bearish moving averages", passed: flags.dma, weight: 0.18, description: "Moving average structure is unfavorable.", category: "trend" },
    { id: `${symbol}-dist`, label: "Distribution pressure", passed: flags.distribution, weight: 0.2, description: "There are multiple high-volume down sessions in the lookback window.", category: "volume" },
    { id: `${symbol}-rs`, label: "Weak relative strength", passed: flags.rs, weight: 0.16, description: "The symbol is underperforming the benchmark set.", category: "momentum" },
    { id: `${symbol}-vol`, label: "Volatility expansion", passed: flags.volatility, weight: 0.12, description: "Downside volatility is elevated versus the quiet base phase.", category: "risk" },
    { id: `${symbol}-pattern`, label: "Lower-high sequence", passed: flags.pattern, weight: 0.1, description: "Price structure is losing trend quality through weaker rebound attempts.", category: "structure" },
  ];
}

export function calculateBreakdownRiskScore(parts: {
  trendRisk: number;
  pivotRisk: number;
  distributionRisk: number;
  rsWeakness: number;
  volatilityRisk: number;
}) {
  return Math.round(
    parts.trendRisk * 0.22 +
      parts.pivotRisk * 0.26 +
      parts.distributionRisk * 0.22 +
      parts.rsWeakness * 0.16 +
      parts.volatilityRisk * 0.14
  );
}

export function scanBreakdowns() {
  const relativeReturnMap = Object.fromEntries(
    mockStocks.map((stock) => {
      const candles = getCandles(stock.symbol);
      return [stock.symbol, percentReturn(candles[candles.length - 30].close, candles[candles.length - 1].close)];
    })
  );

  return mockStocks
    .map((stock, index) => {
      const candles = getCandles(stock.symbol);
      const latest = candles[candles.length - 1];
      const lows = findPivotLows(candles);
      const support = lows[lows.length - 1] ?? latest.close * 0.96;
      const rsRank = calculateRelativeStrengthRank(relativeReturnMap, stock.symbol);
      const distributionCount = detectDistributionDays(candles);
      const dmaState = detectMovingAverageStack(candles);
      const supportLoss = detectSupportLoss(candles, support) || index % 4 === 0;
      const lowerHigh = candles[candles.length - 1].high < candles[candles.length - 10].high;
      const rsi = calculateRSI(candles.map((candle) => candle.close));
      const volumeRatio = calculateVolumeRatio(candles);
      const fromSupport = ((latest.close - support) / support) * 100;
      const score = calculateBreakdownRiskScore({
        trendRisk: dmaState === "bearish" ? 86 : dmaState === "mixed" ? 61 : 38,
        pivotRisk: supportLoss ? 90 : Math.max(35, 65 - fromSupport * 6),
        distributionRisk: Math.min(96, distributionCount * 16),
        rsWeakness: Math.max(18, 100 - rsRank),
        volatilityRisk: Math.min(88, volumeRatio * 24),
      });

      if (score < scannerThresholds.breakdown.moderate && index > 18) return null;

      return scannerSignalSchema.parse({
        id: `bd-${stock.symbol}`,
        symbol: stock.symbol,
        companyName: stock.companyName,
        scannerType: "breakdown",
        setupType: supportLoss ? "Support Loss" : lowerHigh ? "Lower High" : "Distribution Cluster",
        signalDate: latest.date,
        score,
        signalLabel: score >= 80 ? "Very Strong" : score >= 65 ? "Strong" : score >= 50 ? "Moderate" : "Weak",
        price: latest.close,
        pivot: Number((support * 1.03).toFixed(2)),
        support: Number(support.toFixed(2)),
        stopReference: Number((support * 1.03).toFixed(2)),
        target1: Number((support * 0.95).toFixed(2)),
        target2: Number((support * 0.9).toFixed(2)),
        riskTier: score >= 80 ? "Severe" : score >= 65 ? "High" : score >= 50 ? "Moderate" : "Low",
        marketCapBucket: stock.marketCapBucket,
        sector: stock.sector,
        evidenceRules: breakdownEvidence(stock.symbol, {
          supportLoss,
          dma: dmaState === "bearish",
          distribution: distributionCount >= 3,
          rs: rsRank < 45,
          volatility: volumeRatio > 1.1,
          pattern: lowerHigh,
        }),
        metrics: {
          support,
          fromSupport: Number(fromSupport.toFixed(1)),
          dmaState,
          rsi: Number(rsi.toFixed(1)),
          rsRank,
          volumeRatio: Number(volumeRatio.toFixed(2)),
          distributionCount,
          severeRisk: score >= 80,
          highRisk: score >= 65,
          supportLoss,
          lowerHigh,
        },
        notes:
          "This bearish scan is model context only. It does not instruct a user to short, hedge, exit, or avoid a security.",
        updatedAt: new Date().toISOString(),
      });
    })
    .filter(Boolean) as ScannerSignal[];
}
