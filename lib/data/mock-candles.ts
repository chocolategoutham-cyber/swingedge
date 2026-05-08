import { addDays, format, subDays } from "date-fns";
import { dailyCandleSchema, type DailyCandle } from "@/lib/types";
import { mockStocks } from "@/lib/data/mock-stocks";

function seeded(symbol: string) {
  let seed = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function basePriceForSymbol(index: number) {
  return 95 + index * 23;
}

export const mockCandlesBySymbol: Record<string, DailyCandle[]> = Object.fromEntries(
  mockStocks.map((stock, stockIndex) => {
    const rand = seeded(stock.symbol);
    let price = basePriceForSymbol(stockIndex);

    const candles = Array.from({ length: 140 }, (_, index) => {
      const trend = stockIndex % 5 === 0 ? 0.8 : stockIndex % 3 === 0 ? -0.2 : 0.35;
      const noise = (rand() - 0.5) * 2.6;
      const drift = trend + noise;
      const open = price;
      const close = Math.max(18, open + drift);
      const high = Math.max(open, close) + rand() * 2.1;
      const low = Math.min(open, close) - rand() * 1.8;
      const volumeBase = 900000 + stockIndex * 21000;
      const volume = Math.round(volumeBase * (0.85 + rand() * 0.7));
      price = close;

      return dailyCandleSchema.parse({
        symbol: stock.symbol,
        date: format(addDays(subDays(new Date(), 139), index), "yyyy-MM-dd"),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(Math.max(1, low).toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });
    });

    return [stock.symbol, candles];
  })
);

export function getCandles(symbol: string) {
  return mockCandlesBySymbol[symbol] || [];
}
