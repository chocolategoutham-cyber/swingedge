import { NextResponse } from "next/server";
import { buildResearchEngine } from "@/lib/server/research-engine";

export async function GET() {
  const engine = buildResearchEngine();
  return NextResponse.json({
    scanner: "breakout",
    count: engine.scanners.breakouts.length,
    universe: engine.summary.eligibleUniverse,
    rows: engine.scanners.breakouts,
  });
}
