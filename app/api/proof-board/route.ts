import { NextResponse } from "next/server";
import { mockProofRecords } from "@/lib/data/mock-proof-records";
import {
  buildProofEquityCurve,
  calculateProofKpis,
  calculateProofMonthlyStats,
  calculateProofReturnDistribution,
} from "@/lib/scanners/proof";

export async function GET() {
  return NextResponse.json({
    count: mockProofRecords.length,
    kpis: calculateProofKpis(mockProofRecords),
    equityCurve: buildProofEquityCurve(mockProofRecords),
    monthlyStats: calculateProofMonthlyStats(mockProofRecords),
    returnDistribution: calculateProofReturnDistribution(mockProofRecords),
    rows: mockProofRecords,
  });
}
