import { NextResponse } from "next/server";
import { mockMomentumSignals } from "@/lib/data/mock-scanner-runs";

export async function GET() {
  return NextResponse.json({
    scanner: "momentum",
    count: mockMomentumSignals.length,
    rows: mockMomentumSignals,
  });
}
