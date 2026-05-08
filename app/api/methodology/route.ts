import { NextResponse } from "next/server";
import { buildResearchEngine } from "@/lib/server/research-engine";

export async function GET() {
  const engine = buildResearchEngine();
  return NextResponse.json(engine.methodology);
}
