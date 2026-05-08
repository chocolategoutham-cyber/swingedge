import { NextResponse } from "next/server";
import { mockStocks } from "@/lib/data/mock-stocks";
import { getCandles } from "@/lib/data/mock-candles";
import {
  mockBreakdownSignals,
  mockBreakoutSignals,
  mockMomentumSignals,
  mockPreBreakoutSignals,
} from "@/lib/data/mock-scanner-runs";
import { mockProofRecords } from "@/lib/data/mock-proof-records";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const stock = mockStocks.find((candidate) => candidate.symbol === symbol);

  if (!stock) {
    return NextResponse.json({ error: "Stock not found" }, { status: 404 });
  }

  const signals = [
    ...mockPreBreakoutSignals,
    ...mockBreakoutSignals,
    ...mockBreakdownSignals,
    ...mockMomentumSignals,
  ].filter((signal) => signal.symbol === symbol);

  const proof = mockProofRecords.filter((record) => record.symbol === symbol);
  const candles = getCandles(symbol);

  return NextResponse.json({
    stock,
    candles,
    signals,
    proof,
  });
}
