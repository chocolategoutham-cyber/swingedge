import { NextResponse } from "next/server";
import { mockBreakoutSignals } from "@/lib/data/mock-scanner-runs";

export async function GET() {
  return NextResponse.json({
    scanner: "breakout",
    count: mockBreakoutSignals.length,
    rows: mockBreakoutSignals,
  });
}
