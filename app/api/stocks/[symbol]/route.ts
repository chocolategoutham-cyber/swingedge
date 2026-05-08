import { NextResponse } from "next/server";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import { buildResearchEngine } from "@/lib/server/research-engine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const stock = mockStocks.find((candidate) => candidate.symbol === symbol);

  if (!stock) {
    return NextResponse.json({ error: "Stock not found" }, { status: 404 });
  }

  const engine = buildResearchEngine();
  const signals = [
    ...engine.scanners.preBreakout,
    ...engine.scanners.breakouts,
    ...engine.scanners.breakdowns,
    ...engine.scanners.momentum,
  ].filter((signal) => signal.symbol === symbol);

  const proof = engine.scanners.proof.filter((record) => record.symbol === symbol);
  const candles = getCandles(symbol);

  return NextResponse.json({
    stock,
    candles,
    signals,
    proof,
  });
}
