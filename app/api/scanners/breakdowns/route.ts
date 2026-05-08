import { NextResponse } from "next/server";
import { mockBreakdownSignals } from "@/lib/data/mock-scanner-runs";

export async function GET() {
  return NextResponse.json({
    scanner: "breakdown",
    count: mockBreakdownSignals.length,
    rows: mockBreakdownSignals,
  });
}
