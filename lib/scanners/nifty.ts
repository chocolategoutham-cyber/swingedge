import { mockNiftyContext } from "@/lib/data/mock-nifty";
import { scannerThresholds } from "@/lib/config/scanner-thresholds";

export function calculateOiZones() {
  return mockNiftyContext.supportResistanceZones;
}

export function classifySupportResistance(putOi: number, callOi: number) {
  return putOi > callOi ? "support" : "resistance";
}

export function calculateNiftyScore() {
  const { latestPrice, previousClose, intraday, breadthRatio } = mockNiftyContext;
  const priceVsPrevious = latestPrice > previousClose ? 3 : -3;
  const vwapState = intraday[intraday.length - 1].close > intraday[intraday.length - 1].vwap ? 2 : -2;
  const breadth = breadthRatio > 1.15 ? 2 : breadthRatio < 0.9 ? -2 : 0;
  const volatility = Math.abs(latestPrice - previousClose) > 120 ? -1 : 1;
  return Math.max(-15, Math.min(15, priceVsPrevious + vwapState + breadth + volatility));
}

export function classifyNiftyRegime(score: number) {
  if (score >= scannerThresholds.nifty.positive) return "Positive";
  if (score >= scannerThresholds.nifty.constructive) return "Constructive";
  if (score > scannerThresholds.nifty.caution) return "Neutral";
  if (score > scannerThresholds.nifty.negative) return "Caution";
  return "Negative";
}
