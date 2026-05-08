import { NextResponse } from "next/server";
import { buildResearchEngine } from "@/lib/server/research-engine";
import {
  buildProofEquityCurve,
  calculateProofKpis,
  calculateProofMonthlyStats,
  calculateProofReturnDistribution,
} from "@/lib/scanners/proof";

export async function GET() {
  const records = buildResearchEngine().scanners.proof;
  return NextResponse.json({
    count: records.length,
    kpis: calculateProofKpis(records),
    equityCurve: buildProofEquityCurve(records),
    monthlyStats: calculateProofMonthlyStats(records),
    returnDistribution: calculateProofReturnDistribution(records),
    rows: records,
  });
}
