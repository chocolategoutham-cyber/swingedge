import { NextResponse } from "next/server";
import { mockNiftyContext } from "@/lib/data/mock-nifty";
import { calculateNiftyScore, classifyNiftyRegime } from "@/lib/scanners/nifty";

export async function GET() {
  const score = calculateNiftyScore();

  return NextResponse.json({
    ...mockNiftyContext,
    score,
    label: classifyNiftyRegime(score),
  });
}
