import type {
  DailyCandle,
  MarketInsights,
  MethodologyOverview,
  NiftyContext,
  ProofRecord,
  ScannerSignal,
  ScanEngineSummary,
  Stock,
  StockChartLevel,
  StockInsightCard,
  StockOverview,
  StockProofSnapshot,
  StockStageEvent,
} from "@/lib/types";

const API_BASE =
  process.env.SIGNALLENS_SERVER_URL ||
  process.env.NEXT_PUBLIC_SIGNALLENS_SERVER_URL ||
  "https://signallens-server.cloud-notes-api.workers.dev";

export const publicApiBase = API_BASE;

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type ScannerApiResponse = {
  scanner: string;
  count: number;
  universe?: number;
  rows: ScannerSignal[];
};

export type ProofBoardApiResponse = {
  count: number;
  kpis: {
    totalTrackedSignals: number;
    closedSignals: number;
    openSignals: number;
    targetHitCount: number;
    stopReferenceBreachCount: number;
    expiredCount: number;
    winRate: number;
    averageReturn: number;
    medianHoldingDays: number;
    maxDrawdown: number;
    bestOutcome: number;
    worstOutcome: number;
  };
  equityCurve: Array<{ date: string; value: number }>;
  monthlyStats: Array<{ month: string; winRate: number; closed: number }>;
  returnDistribution: Array<{ bucket: string; count: number }>;
  rows: ProofRecord[];
};

export type MetaApiResponse = {
  product: string;
  generatedAt: string;
  summary: ScanEngineSummary;
  disclaimer: string;
};

export type UniverseApiResponse = {
  generatedAt: string;
  summary: ScanEngineSummary;
  rows: Array<Record<string, unknown>>;
};

export type StockDetailApiResponse = {
  stock: Stock;
  candles: DailyCandle[];
  signals: ScannerSignal[];
  proof: ProofRecord[];
  overview: StockOverview;
  latestSignal: ScannerSignal | null;
  chartLevels: StockChartLevel[];
  insightCards: StockInsightCard[];
  stageTimeline: StockStageEvent[];
  proofSnapshot: StockProofSnapshot | null;
  referenceTexts: {
    scannerSummary: string;
    chartSummary: string;
  };
};

export function getMeta() {
  return fetchJson<MetaApiResponse>("/api/meta");
}

export function getMethodology() {
  return fetchJson<MethodologyOverview>("/api/methodology");
}

export function getUniverse() {
  return fetchJson<UniverseApiResponse>("/api/universe");
}

export function getPreBreakoutScanner() {
  return fetchJson<ScannerApiResponse>("/api/scanners/pre-breakout");
}

export function getBreakoutScanner() {
  return fetchJson<ScannerApiResponse>("/api/scanners/breakouts");
}

export function getBreakdownScanner() {
  return fetchJson<ScannerApiResponse>("/api/scanners/breakdowns");
}

export function getMomentumScanner() {
  return fetchJson<ScannerApiResponse>("/api/scanners/momentum");
}

export function getProofBoard() {
  return fetchJson<ProofBoardApiResponse>("/api/proof-board");
}

export function getInsights() {
  return fetchJson<MarketInsights>("/api/insights");
}

export function getNifty() {
  return fetchJson<NiftyContext>("/api/nifty");
}

export function getStockDetail(symbol: string) {
  return fetchJson<StockDetailApiResponse>(`/api/stocks/${symbol}`);
}
