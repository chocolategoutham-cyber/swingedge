import type { ScannerSignal } from "@/lib/types";
import { buildResearchEngine } from "@/lib/server/research-engine";

const engine = buildResearchEngine();

export const mockPreBreakoutSignals = engine.scanners.preBreakout;
export const mockBreakoutSignals = engine.scanners.breakouts;
export const mockBreakdownSignals = engine.scanners.breakdowns;
export const mockMomentumSignals = engine.scanners.momentum;

export function getSignalsByScanner(scanner: ScannerSignal["scannerType"]) {
  if (scanner === "pre-breakout") return mockPreBreakoutSignals;
  if (scanner === "breakout") return mockBreakoutSignals;
  if (scanner === "breakdown") return mockBreakdownSignals;
  return mockMomentumSignals;
}
