import { NextResponse } from "next/server";
import { mockPreBreakoutSignals } from "@/lib/data/mock-scanner-runs";

export async function GET() {
  return NextResponse.json({
    scanner: "pre-breakout",
    count: mockPreBreakoutSignals.length,
    rows: mockPreBreakoutSignals,
  });
}
