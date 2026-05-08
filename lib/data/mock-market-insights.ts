import { marketInsightsSchema, sectorSnapshotSchema, type MarketInsights } from "@/lib/types";

const sectors = [
  "Technology",
  "Banking",
  "Financials",
  "Pharma",
  "FMCG",
  "Metals",
  "Energy",
  "Infrastructure",
  "Auto",
  "Telecom",
  "Real Estate",
  "Utilities",
];

export const mockMarketInsights: MarketInsights = marketInsightsSchema.parse({
  dateTime: new Date().toISOString(),
  marketPulse: "Constructive leadership with selective participation",
  breadthLabel: "Mixed",
  riskRegime: "Rotation-led with moderate volatility",
  newHighs: 41,
  newLows: 18,
  advancers: 1142,
  decliners: 891,
  unchanged: 152,
  advanceDeclineRatio: 1.28,
  percentAbove20dma: 58,
  percentAbove50dma: 52,
  percentAbove200dma: 46,
  sectors: sectors.map((sector, index) =>
    sectorSnapshotSchema.parse({
      sector,
      return1w: Number((2.8 - index * 0.35).toFixed(1)),
      return1m: Number((6.4 - index * 0.52).toFixed(1)),
      return3m: Number((12.4 - index * 0.88).toFixed(1)),
      rsScore: Math.max(28, 91 - index * 5),
      trendState:
        index < 3 ? "Leading" : index < 6 ? "Improving" : index < 9 ? "Lagging" : "Weakening",
      breadthScore: Math.max(22, 80 - index * 4),
    })
  ),
});
