import type { DailyCandle } from "@/lib/types";

export function calculateSMA(values: number[], period: number) {
  if (values.length < period) return 0;
  const slice = values.slice(-period);
  return slice.reduce((sum, value) => sum + value, 0) / period;
}

export function calculateEMA(values: number[], period: number) {
  if (!values.length) return 0;
  const multiplier = 2 / (period + 1);
  return values.reduce((ema, price, index) => {
    if (index === 0) return price;
    return (price - ema) * multiplier + ema;
  }, values[0]);
}

export function calculateRSI(values: number[], period = 14) {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let index = values.length - period; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }
  if (losses === 0) return 100;
  const rs = gains / period / (losses / period);
  return 100 - 100 / (1 + rs);
}

export function calculateADX(candles: DailyCandle[], period = 14) {
  if (candles.length <= period) return 20;
  const recent = candles.slice(-period);
  const directionalMove = recent.reduce((sum, candle, index) => {
    if (index === 0) return sum;
    const previous = recent[index - 1];
    return sum + Math.abs(candle.close - previous.close);
  }, 0);
  const range = recent.reduce((sum, candle) => sum + (candle.high - candle.low), 0);
  return Math.min(55, (directionalMove / Math.max(range, 1)) * 100);
}

export function calculateATR(candles: DailyCandle[], period = 14) {
  if (candles.length < period + 1) return 0;
  const recent = candles.slice(-period);
  const ranges = recent.map((candle, index) => {
    const previousClose = index === 0 ? candle.close : recent[index - 1].close;
    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - previousClose),
      Math.abs(candle.low - previousClose)
    );
  });
  return ranges.reduce((sum, value) => sum + value, 0) / ranges.length;
}

export function calculateVolumeRatio(candles: DailyCandle[], period = 20) {
  if (candles.length < period) return 1;
  const volumes = candles.map((candle) => candle.volume);
  const latest = volumes[volumes.length - 1];
  const average =
    volumes.slice(-period).reduce((sum, value) => sum + value, 0) / period;
  return latest / Math.max(average, 1);
}

export function calculateVolumeZScore(candles: DailyCandle[], period = 20) {
  if (candles.length < period) return 0;
  const volumes = candles.slice(-period).map((candle) => candle.volume);
  const mean = volumes.reduce((sum, value) => sum + value, 0) / volumes.length;
  const variance =
    volumes.reduce((sum, value) => sum + (value - mean) ** 2, 0) / volumes.length;
  const standardDeviation = Math.sqrt(variance) || 1;
  return (volumes[volumes.length - 1] - mean) / standardDeviation;
}

export function calculateRelativeStrengthRank(
  symbolReturns: Record<string, number>,
  symbol: string
) {
  const ranked = Object.values(symbolReturns).sort((a, b) => b - a);
  const value = symbolReturns[symbol] ?? 0;
  const index = ranked.findIndex((candidate) => candidate <= value);
  if (index === -1) return 50;
  return Math.max(1, Math.round(100 - (index / Math.max(ranked.length - 1, 1)) * 99));
}

export function calculateDrawdown(series: number[]) {
  let peak = series[0] ?? 0;
  let maxDrawdown = 0;
  for (const value of series) {
    peak = Math.max(peak, value);
    maxDrawdown = Math.min(maxDrawdown, value - peak);
  }
  return maxDrawdown;
}

export function percentReturn(start: number, end: number) {
  if (!start) return 0;
  return ((end - start) / start) * 100;
}
