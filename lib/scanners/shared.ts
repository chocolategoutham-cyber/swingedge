import type { DailyCandle } from "@/lib/types";
import {
  calculateEMA,
  calculateSMA,
  calculateVolumeRatio,
  calculateVolumeZScore,
} from "@/lib/scanners/indicators";

export function findPivotHighs(candles: DailyCandle[]) {
  const recent = candles.slice(-25);
  const pivots: number[] = [];

  for (let index = 2; index < recent.length - 2; index += 1) {
    const candle = recent[index];
    if (
      candle.high >= recent[index - 1].high &&
      candle.high >= recent[index + 1].high
    ) {
      pivots.push(candle.high);
    }
  }

  return pivots;
}

export function findPivotLows(candles: DailyCandle[]) {
  const recent = candles.slice(-25);
  const pivots: number[] = [];

  for (let index = 2; index < recent.length - 2; index += 1) {
    const candle = recent[index];
    if (
      candle.low <= recent[index - 1].low &&
      candle.low <= recent[index + 1].low
    ) {
      pivots.push(candle.low);
    }
  }

  return pivots;
}

export function detectBaseRange(candles: DailyCandle[]) {
  const recent = candles.slice(-30);
  const highs = recent.map((candle) => candle.high);
  const lows = recent.map((candle) => candle.low);
  return {
    high: Math.max(...highs),
    low: Math.min(...lows),
    widthPct: ((Math.max(...highs) - Math.min(...lows)) / Math.min(...lows)) * 100,
  };
}

export function calculateBaseQuality(candles: DailyCandle[]) {
  const base = detectBaseRange(candles);
  const tightness = Math.max(0, 100 - base.widthPct * 4);
  const slopePenalty = Math.abs(candles[candles.length - 1].close - candles[candles.length - 20].close);
  return Math.max(10, Math.min(98, tightness - slopePenalty * 0.03));
}

export function calculateBreakoutProximity(price: number, pivot: number) {
  return ((price - pivot) / pivot) * 100;
}

export function detectVolumeDryUp(candles: DailyCandle[]) {
  const last5 = candles.slice(-5).reduce((sum, candle) => sum + candle.volume, 0) / 5;
  const last20 = candles.slice(-20).reduce((sum, candle) => sum + candle.volume, 0) / 20;
  return {
    isDrying: last5 < last20 * 0.88,
    score: Math.max(0, Math.min(100, 100 - calculateVolumeZScore(candles, 20) * 18)),
  };
}

export function detectVcpLikeCompression(candles: DailyCandle[]) {
  const windows = [30, 20, 10].map((period) => detectBaseRange(candles.slice(-period)).widthPct);
  return windows[0] > windows[1] && windows[1] > windows[2];
}

export function detectHighTightFlag(candles: DailyCandle[]) {
  const poleStart = candles[candles.length - 30]?.close ?? candles[0]?.close ?? 0;
  const poleHigh = Math.max(...candles.slice(-20).map((candle) => candle.high));
  const pullbackLow = Math.min(...candles.slice(-10).map((candle) => candle.low));
  const poleGain = ((poleHigh - poleStart) / poleStart) * 100;
  const pullbackDepth = ((poleHigh - pullbackLow) / poleHigh) * 100;
  return poleGain > 18 && pullbackDepth < 15 && calculateVolumeRatio(candles) > 1.2;
}

export function detectTightRangeContraction(candles: DailyCandle[]) {
  const width = detectBaseRange(candles.slice(-12)).widthPct;
  return width < 7;
}

export function detectSupportLoss(candles: DailyCandle[], support: number) {
  const latest = candles[candles.length - 1]?.close ?? support;
  return ((latest - support) / support) * 100 < -1.2;
}

export function detectDistributionDays(candles: DailyCandle[]) {
  const recent = candles.slice(-20);
  const averageVolume =
    recent.reduce((sum, candle) => sum + candle.volume, 0) / recent.length;
  return recent.filter(
    (candle, index) =>
      index > 0 &&
      candle.close < candle.open &&
      candle.volume > averageVolume * 1.1 &&
      candle.close <= candle.low + (candle.high - candle.low) * 0.25
  ).length;
}

export function detectMovingAverageStack(candles: DailyCandle[]) {
  const closes = candles.map((candle) => candle.close);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const ema21 = calculateEMA(closes, 21);
  const sma200 = calculateSMA(closes, 100);
  const latest = closes[closes.length - 1] ?? 0;

  if (latest > ema21 && ema21 > sma50 && sma50 > sma200) return "bullish";
  if (latest < ema21 && ema21 < sma50 && sma50 < sma200) return "bearish";
  return "mixed";
}
