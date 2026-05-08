import { scanEngineSummarySchema, type ScanEngineSummary } from "@/lib/types";
import { buildMarketUniverseProfiles, buildMethodologyOverview, getEligibleStocks } from "@/lib/server/market-universe";
import { scanPreBreakouts } from "@/lib/scanners/preBreakout";
import { scanBreakouts } from "@/lib/scanners/breakout";
import { scanBreakdowns } from "@/lib/scanners/breakdown";
import { scanMomentumLeaders } from "@/lib/scanners/momentum";
import { createProofRecordFromSignal } from "@/lib/scanners/proof";
import { mockStocks } from "@/lib/data/mock-stocks";
import { buildMarketInsightsFromUniverse } from "@/lib/scanners/insights";

export function buildResearchEngine() {
  const profiles = buildMarketUniverseProfiles(mockStocks);
  const eligibleStocks = getEligibleStocks(mockStocks);
  const preBreakout = scanPreBreakouts(eligibleStocks).slice(0, 22);
  const breakouts = scanBreakouts(eligibleStocks).slice(0, 22);
  const breakdowns = scanBreakdowns(eligibleStocks).slice(0, 16);
  const momentum = scanMomentumLeaders(eligibleStocks).slice(0, 22);
  const proofSeed = [
    ...preBreakout.slice(0, 8),
    ...breakouts.slice(0, 6),
    ...breakdowns.slice(0, 4),
    ...momentum.slice(0, 6),
  ];
  const proof = proofSeed.map((signal, index) => createProofRecordFromSignal(signal, index));
  const sleeveCounts = profiles.reduce<Record<string, number>>((accumulator, profile) => {
    accumulator[profile.sleeve] = (accumulator[profile.sleeve] ?? 0) + Number(profile.isEligible);
    return accumulator;
  }, {});

  const summary: ScanEngineSummary = scanEngineSummarySchema.parse({
    generatedAt: new Date().toISOString(),
    totalUniverse: profiles.length,
    eligibleUniverse: eligibleStocks.length,
    excludedUniverse: profiles.length - eligibleStocks.length,
    sleeveCounts,
    scannerCounts: {
      preBreakout: preBreakout.length,
      breakout: breakouts.length,
      breakdown: breakdowns.length,
      momentum: momentum.length,
      proof: proof.length,
    },
    methodologyNote:
      "This engine follows the public methodology language: NSE sleeve universe, liquidity-aware gates, structure/trend/participation/proximity analysis, and transparent proof updates.",
  });

  return {
    generatedAt: summary.generatedAt,
    profiles,
    eligibleStocks,
    methodology: buildMethodologyOverview(),
    summary,
    scanners: {
      preBreakout,
      breakouts,
      breakdowns,
      momentum,
      proof,
    },
    insights: buildMarketInsightsFromUniverse(eligibleStocks),
  };
}
