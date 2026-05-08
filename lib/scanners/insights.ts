import { mockMarketInsights } from "@/lib/data/mock-market-insights";
import type { SectorSnapshot } from "@/lib/types";

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
