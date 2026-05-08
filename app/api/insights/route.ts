import { NextResponse } from "next/server";
import { mockMarketInsights } from "@/lib/data/mock-market-insights";

export async function GET() {
  return NextResponse.json(mockMarketInsights);
}
