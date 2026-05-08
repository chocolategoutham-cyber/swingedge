import { proofRecordSchema, type ProofRecord, type ScannerSignal } from "@/lib/types";
import { holdingDays, inDays } from "@/lib/utils/date";
import { calculateDrawdown } from "@/lib/scanners/indicators";

export function createProofRecordFromSignal(signal: ScannerSignal, index: number) {
  const firstSeenDate = signal.signalDate;
  const currentPrice = signal.price * (1 + ((index % 6) - 2) * 0.03);
  const high = signal.price * (1 + ((index % 5) + 1) * 0.04);
  const low = signal.price * (1 - ((index % 4) + 1) * 0.025);
  const record = proofRecordSchema.parse({
    id: `proof-${signal.id}`,
    signalId: signal.id,
    symbol: signal.symbol,
    scannerSource: signal.scannerType,
    setupType: signal.setupType,
    firstSeenDate,
    entryReference: signal.price,
    stopReference: signal.stopReference,
    target1: signal.target1,
    target2: signal.target2,
    currentPrice: Number(currentPrice.toFixed(2)),
    originalScore: signal.score,
    riskTier: signal.riskTier,
    companyName: signal.companyName,
    sector: signal.sector,
    marketCapBucket: signal.marketCapBucket,
    evidenceRules: signal.evidenceRules,
    timeline: [
      { date: firstSeenDate, title: "First detected", description: "Signal first entered the scanner history.", type: "detected" },
    ],
    status: "Open",
    returnPct: 0,
    holdingDays: 0,
    notes: "Open proof record awaiting outcome update.",
  });

  return updateProofOutcome(record, {
    high,
    low,
    close: currentPrice,
    currentDate: inDays(firstSeenDate, 6 + (index % 28)),
    expiryDate: inDays(firstSeenDate, 24),
    invalidationLevel: signal.stopReference * 1.005,
  });
}

export function updateProofOutcome(
  record: ProofRecord,
  payload: {
    high: number;
    low: number;
    close: number;
    currentDate: string;
    expiryDate: string;
    invalidationLevel: number;
  }
) {
  let status: ProofRecord["status"] = "Open";
  if (payload.high >= record.target2) status = "Target 2 Hit";
  else if (payload.high >= record.target1) status = "Partial Target";
  else if (payload.low <= record.stopReference) status = "Stop/Reference Breach";
  else if (new Date(payload.currentDate) > new Date(payload.expiryDate)) status = "Expired";
  else if (payload.close < payload.invalidationLevel) status = "Invalidated";

  const exitPrice = status === "Open" ? undefined : payload.close;
  const returnPct = ((payload.close - record.entryReference) / record.entryReference) * 100;
  const timeline = [...record.timeline];

  if (status !== "Open") {
    timeline.push({
      date: payload.currentDate,
      title: status,
      description: `Historical outcome recorded as ${status.toLowerCase()}.`,
      type:
        status === "Stop/Reference Breach"
          ? "stop"
          : status === "Expired"
            ? "expired"
            : status === "Invalidated"
              ? "invalidated"
              : "target",
    });
  }

  return proofRecordSchema.parse({
    ...record,
    status,
    exitPrice,
    currentPrice: payload.close,
    returnPct: Number(returnPct.toFixed(1)),
    holdingDays: holdingDays(record.firstSeenDate, payload.currentDate),
    timeline,
    notes:
      status === "Open"
        ? "Signal remains open in the tracker."
        : `Outcome tracker shows ${status.toLowerCase()} based on historical mock pathing.`,
  });
}

export function calculateProofWinRate(records: ProofRecord[]) {
  const closed = records.filter((record) => record.status !== "Open");
  const winners = closed.filter((record) =>
    ["Target 2 Hit", "Target 1 Hit", "Partial Target"].includes(record.status)
  );
  return closed.length ? (winners.length / closed.length) * 100 : 0;
}

export function buildProofEquityCurve(records: ProofRecord[]) {
  let cumulative = 0;
  return records
    .filter((record) => record.status !== "Open")
    .sort((left, right) => left.firstSeenDate.localeCompare(right.firstSeenDate))
    .map((record) => {
      cumulative += record.returnPct;
      return { date: record.firstSeenDate, value: Number(cumulative.toFixed(1)) };
    });
}

export function calculateProofReturnDistribution(records: ProofRecord[]) {
  return [
    { bucket: "< -5%", count: records.filter((record) => record.returnPct < -5).length },
    { bucket: "-5% to 0%", count: records.filter((record) => record.returnPct >= -5 && record.returnPct < 0).length },
    { bucket: "0% to 5%", count: records.filter((record) => record.returnPct >= 0 && record.returnPct < 5).length },
    { bucket: "5% to 10%", count: records.filter((record) => record.returnPct >= 5 && record.returnPct < 10).length },
    { bucket: "> 10%", count: records.filter((record) => record.returnPct >= 10).length },
  ];
}

export function calculateProofMonthlyStats(records: ProofRecord[]) {
  const buckets: Record<string, { wins: number; closed: number }> = {};
  records
    .filter((record) => record.status !== "Open")
    .forEach((record) => {
      const month = record.firstSeenDate.slice(0, 7);
      buckets[month] = buckets[month] || { wins: 0, closed: 0 };
      buckets[month].closed += 1;
      if (["Target 2 Hit", "Target 1 Hit", "Partial Target"].includes(record.status)) {
        buckets[month].wins += 1;
      }
    });

  return Object.entries(buckets).map(([month, value]) => ({
    month,
    winRate: value.closed ? Number(((value.wins / value.closed) * 100).toFixed(1)) : 0,
    closed: value.closed,
  }));
}

export function calculateProofDrawdown(records: ProofRecord[]) {
  return calculateDrawdown(buildProofEquityCurve(records).map((point) => point.value));
}

export function calculateProofKpis(records: ProofRecord[]) {
  const closed = records.filter((record) => record.status !== "Open");
  const targetHits = closed.filter((record) =>
    ["Target 2 Hit", "Target 1 Hit", "Partial Target"].includes(record.status)
  );
  const stopHits = closed.filter((record) => record.status === "Stop/Reference Breach");
  const expired = closed.filter((record) => record.status === "Expired");
  const averageReturn =
    closed.reduce((sum, record) => sum + record.returnPct, 0) / Math.max(closed.length, 1);
  const sortedHoldingDays = closed.map((record) => record.holdingDays).sort((a, b) => a - b);
  const medianHoldingDays = sortedHoldingDays[Math.floor(sortedHoldingDays.length / 2)] ?? 0;
  const best = closed.reduce((bestRecord, record) => (record.returnPct > bestRecord.returnPct ? record : bestRecord), closed[0] ?? records[0]);
  const worst = closed.reduce((worstRecord, record) => (record.returnPct < worstRecord.returnPct ? record : worstRecord), closed[0] ?? records[0]);

  return {
    totalTrackedSignals: records.length,
    closedSignals: closed.length,
    openSignals: records.length - closed.length,
    targetHitCount: targetHits.length,
    stopReferenceBreachCount: stopHits.length,
    expiredCount: expired.length,
    winRate: Number(calculateProofWinRate(records).toFixed(1)),
    averageReturn: Number(averageReturn.toFixed(1)),
    medianHoldingDays,
    maxDrawdown: Number(calculateProofDrawdown(records).toFixed(1)),
    bestOutcome: best?.returnPct ?? 0,
    worstOutcome: worst?.returnPct ?? 0,
  };
}
