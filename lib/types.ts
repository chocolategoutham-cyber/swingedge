import { z } from "zod";

export const marketCapBucketSchema = z.enum([
  "Large-Mid",
  "Small Cap",
  "Micro Cap",
]);

export const scannerTypeSchema = z.enum([
  "pre-breakout",
  "breakout",
  "breakdown",
  "momentum",
]);

export const evidenceCategorySchema = z.enum([
  "trend",
  "volume",
  "structure",
  "momentum",
  "risk",
  "breadth",
]);

export const proofStatusSchema = z.enum([
  "Target 2 Hit",
  "Target 1 Hit",
  "Partial Target",
  "Stop/Reference Breach",
  "Expired",
  "Invalidated",
  "Open",
]);

export const riskTierSchema = z.enum(["Severe", "High", "Moderate", "Low"]);
export const signalStrengthSchema = z.enum([
  "Very Strong",
  "Strong",
  "Watch",
  "Moderate",
  "Weak",
]);

export const niftyLabelSchema = z.enum([
  "Positive",
  "Constructive",
  "Neutral",
  "Caution",
  "Negative",
]);

export const sectorTrendSchema = z.enum([
  "Leading",
  "Improving",
  "Lagging",
  "Weakening",
]);

export const universeSleeveSchema = z.enum([
  "Nifty 500",
  "Nifty SmallCap 250",
  "Nifty MicroCap 250",
]);

export const evidenceRuleSchema = z.object({
  id: z.string(),
  label: z.string(),
  passed: z.boolean(),
  weight: z.number(),
  description: z.string(),
  category: evidenceCategorySchema,
});

export const stockSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  sector: z.string(),
  marketCapBucket: marketCapBucketSchema,
  exchange: z.literal("NSE"),
  isin: z.string().optional(),
  isWatchlisted: z.boolean().optional(),
});

export const dailyCandleSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export const scannerSignalSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  companyName: z.string(),
  scannerType: scannerTypeSchema,
  setupType: z.string(),
  signalDate: z.string(),
  score: z.number(),
  signalLabel: signalStrengthSchema,
  price: z.number(),
  pivot: z.number().optional(),
  support: z.number().optional(),
  stopReference: z.number(),
  target1: z.number(),
  target2: z.number(),
  riskTier: riskTierSchema,
  marketCapBucket: marketCapBucketSchema,
  sector: z.string(),
  evidenceRules: z.array(evidenceRuleSchema),
  metrics: z.record(z.union([z.number(), z.string(), z.boolean(), z.null()])),
  notes: z.string(),
  updatedAt: z.string(),
});

export const proofTimelineEventSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum([
    "detected",
    "confirmed",
    "target",
    "stop",
    "expired",
    "invalidated",
    "update",
  ]),
});

export const proofRecordSchema = z.object({
  id: z.string(),
  signalId: z.string(),
  symbol: z.string(),
  scannerSource: scannerTypeSchema,
  setupType: z.string(),
  firstSeenDate: z.string(),
  entryReference: z.number(),
  stopReference: z.number(),
  target1: z.number(),
  target2: z.number(),
  currentPrice: z.number(),
  exitPrice: z.number().optional(),
  status: proofStatusSchema,
  returnPct: z.number(),
  holdingDays: z.number(),
  originalScore: z.number(),
  riskTier: riskTierSchema,
  timeline: z.array(proofTimelineEventSchema),
  evidenceRules: z.array(evidenceRuleSchema),
  notes: z.string(),
  companyName: z.string(),
  sector: z.string(),
  marketCapBucket: marketCapBucketSchema,
});

export const oiZoneSchema = z.object({
  strike: z.number(),
  callOi: z.number(),
  putOi: z.number(),
  context: z.string(),
  label: z.enum(["support", "resistance"]),
});

export const niftyContextSchema = z.object({
  dateTime: z.string(),
  score: z.number(),
  label: niftyLabelSchema,
  trendScore: z.number(),
  breadthScore: z.number(),
  momentumScore: z.number(),
  volatilityScore: z.number(),
  vwapState: z.enum(["above", "below", "flat"]),
  supportResistanceZones: z.array(oiZoneSchema),
  notes: z.string(),
  breadthRatio: z.number(),
  latestPrice: z.number(),
  previousClose: z.number(),
  intraday: z.array(
    z.object({
      time: z.string(),
      close: z.number(),
      vwap: z.number(),
    })
  ),
});

export const sectorSnapshotSchema = z.object({
  sector: z.string(),
  return1w: z.number(),
  return1m: z.number(),
  return3m: z.number(),
  rsScore: z.number(),
  trendState: sectorTrendSchema,
  breadthScore: z.number(),
});

export const marketInsightsSchema = z.object({
  dateTime: z.string(),
  marketPulse: z.string(),
  breadthLabel: z.enum(["Strong", "Mixed", "Narrow", "Weak"]),
  riskRegime: z.string(),
  newHighs: z.number(),
  newLows: z.number(),
  advancers: z.number(),
  decliners: z.number(),
  unchanged: z.number(),
  advanceDeclineRatio: z.number(),
  percentAbove20dma: z.number(),
  percentAbove50dma: z.number(),
  percentAbove200dma: z.number(),
  sectors: z.array(sectorSnapshotSchema),
});

export const stockDetailSnapshotSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  sector: z.string(),
  marketCapBucket: marketCapBucketSchema,
  latestPrice: z.number(),
  lastUpdated: z.string(),
  rsi: z.number(),
  adx: z.number(),
  rsRank: z.number(),
  volumeRatio: z.number(),
  atr: z.number(),
  distanceFromPivot: z.number(),
  distanceFromSupport: z.number(),
});

export const marketUniverseProfileSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  sleeve: universeSleeveSchema,
  averageDailyTradedValue20: z.number(),
  averageVolume20d: z.number(),
  staleSessions20d: z.number(),
  participationScore: z.number(),
  liquidityScore: z.number(),
  passesLiquidity: z.boolean(),
  passesFreshness: z.boolean(),
  isEligible: z.boolean(),
  exclusionReason: z.string().nullable(),
});

export const methodologyOverviewSchema = z.object({
  universe: z.object({
    venue: z.literal("NSE"),
    sleeves: z.array(universeSleeveSchema),
    notes: z.array(z.string()),
  }),
  principles: z.array(z.string()),
  scannerVocabulary: z.array(z.string()),
  updateCadence: z.array(z.string()),
  disclaimer: z.string(),
});

export const scanEngineSummarySchema = z.object({
  generatedAt: z.string(),
  totalUniverse: z.number(),
  eligibleUniverse: z.number(),
  excludedUniverse: z.number(),
  sleeveCounts: z.record(z.number()),
  scannerCounts: z.object({
    preBreakout: z.number(),
    breakout: z.number(),
    breakdown: z.number(),
    momentum: z.number(),
    proof: z.number(),
  }),
  methodologyNote: z.string(),
});

export type Stock = z.infer<typeof stockSchema>;
export type DailyCandle = z.infer<typeof dailyCandleSchema>;
export type EvidenceRule = z.infer<typeof evidenceRuleSchema>;
export type ScannerSignal = z.infer<typeof scannerSignalSchema>;
export type ProofTimelineEvent = z.infer<typeof proofTimelineEventSchema>;
export type ProofRecord = z.infer<typeof proofRecordSchema>;
export type NiftyContext = z.infer<typeof niftyContextSchema>;
export type SectorSnapshot = z.infer<typeof sectorSnapshotSchema>;
export type MarketInsights = z.infer<typeof marketInsightsSchema>;
export type StockDetailSnapshot = z.infer<typeof stockDetailSnapshotSchema>;
export type MarketUniverseProfile = z.infer<typeof marketUniverseProfileSchema>;
export type MethodologyOverview = z.infer<typeof methodologyOverviewSchema>;
export type ScanEngineSummary = z.infer<typeof scanEngineSummarySchema>;
export type UniverseSleeve = z.infer<typeof universeSleeveSchema>;

export type ScannerFilters = {
  search: string;
  watchlistOnly: boolean;
  signal: string;
  marketCap: string;
  quality: string;
  sector: string;
  pattern: string;
  riskTier: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
};

export type ProofFilters = {
  search: string;
  scannerSource: string;
  status: string;
  timeRange: "7D" | "30D" | "90D" | "1Y" | "All";
  marketCap: string;
  sector: string;
  riskTier: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
};
