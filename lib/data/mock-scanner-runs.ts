import type { ScannerSignal } from "@/lib/types";
import { scanPreBreakouts } from "@/lib/scanners/preBreakout";
import { scanBreakouts } from "@/lib/scanners/breakout";
import { scanBreakdowns } from "@/lib/scanners/breakdown";
import { scanMomentumLeaders } from "@/lib/scanners/momentum";

export const mockPreBreakoutSignals = scanPreBreakouts().slice(0, 22);
export const mockBreakoutSignals = scanBreakouts().slice(0, 22);
export const mockBreakdownSignals = scanBreakdowns().slice(0, 16);
export const mockMomentumSignals = scanMomentumLeaders().slice(0, 22);

export function getSignalsByScanner(scanner: ScannerSignal["scannerType"]) {
  if (scanner === "pre-breakout") return mockPreBreakoutSignals;
  if (scanner === "breakout") return mockBreakoutSignals;
  if (scanner === "breakdown") return mockBreakdownSignals;
  return mockMomentumSignals;
}
