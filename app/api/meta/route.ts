import { NextResponse } from "next/server";
import { buildResearchEngine } from "@/lib/server/research-engine";

export async function GET() {
  const engine = buildResearchEngine();

  return NextResponse.json({
    product: "SignalLens",
    generatedAt: engine.generatedAt,
    summary: engine.summary,
    disclaimer:
      "This backend follows public methodology concepts only. It does not reproduce any private proprietary formula from third-party software.",
  });
}
