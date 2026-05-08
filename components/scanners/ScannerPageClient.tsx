"use client";

import { useState } from "react";
import type { ScannerFilters, ScannerSignal } from "@/lib/types";
import ScannerFiltersBar from "@/components/scanners/ScannerFilters";
import ScannerTable from "@/components/scanners/ScannerTable";
import EmptyState from "@/components/common/EmptyState";

const defaultFilters: ScannerFilters = {
  search: "",
  watchlistOnly: false,
  signal: "All",
  marketCap: "All",
  quality: "All",
  sector: "All",
  pattern: "All",
  riskTier: "All",
  sortBy: "score",
  sortDirection: "desc",
};

function applyScannerFilters(rows: ScannerSignal[], filters: ScannerFilters) {
  const filtered = rows.filter((row) => {
    const searchHit =
      !filters.search ||
      row.symbol.toLowerCase().includes(filters.search.toLowerCase()) ||
      row.companyName.toLowerCase().includes(filters.search.toLowerCase());
    const watchlistHit = !filters.watchlistOnly || row.symbol.length % 2 === 0;
    const signalHit = filters.signal === "All" || row.signalLabel === filters.signal;
    const capHit = filters.marketCap === "All" || row.marketCapBucket === filters.marketCap;
    const sectorHit = filters.sector === "All" || row.sector === filters.sector;
    const patternHit =
      filters.pattern === "All" ||
      row.setupType === filters.pattern ||
      row.metrics.activeBreakout === (filters.pattern === "Active Breakout") ||
      row.metrics.htf === (filters.pattern === "HTF");
    const riskHit = filters.riskTier === "All" || row.riskTier === filters.riskTier;

    const qualityHit =
      filters.quality === "All" ||
      row.metrics[qualityKeyMap[filters.quality] || filters.quality] === true;

    return searchHit && watchlistHit && signalHit && capHit && sectorHit && patternHit && riskHit && qualityHit;
  });

  const sorted = [...filtered].sort((left, right) => {
    const leftValue = extractSortValue(left, filters.sortBy);
    const rightValue = extractSortValue(right, filters.sortBy);
    if (leftValue === rightValue) return 0;
    return filters.sortDirection === "asc"
      ? leftValue > rightValue
        ? 1
        : -1
      : leftValue < rightValue
        ? 1
        : -1;
  });

  return sorted;
}

function extractSortValue(row: ScannerSignal, key: string) {
  if (key === "score") return row.score;
  if (key === "rsRank") return Number(row.metrics.rsRank ?? 0);
  if (key === "baseQuality") return Number(row.metrics.baseQuality ?? 0);
  if (key === "fromPivot") return Number(row.metrics.fromPivot ?? 0);
  if (key === "volumeDryUp") return Number(row.metrics.volumeQuality ?? row.metrics.volumeRatio ?? 0);
  if (key === "gain10d") return Number(row.metrics.gain10d ?? 0);
  if (key === "gain20d") return Number(row.metrics.gain20d ?? 0);
  if (key === "volumeRatio") return Number(row.metrics.volumeRatio ?? 0);
  if (key === "riskScore") return row.score;
  if (key === "distributionCount") return Number(row.metrics.distributionCount ?? 0);
  if (key === "rsi") return Number(row.metrics.rsi ?? 0);
  return Number(row.metrics[key] ?? row.score ?? 0);
}

const qualityKeyMap: Record<string, string> = {
  "High Base": "highBase",
  "Volume Confirmed": "volumeConfirmed",
  "Leading RS": "leadingRs",
  "Low Risk": "lowRisk",
  "High Accuracy": "highAccuracy",
};

export default function ScannerPageClient({
  rows,
  mode,
  emptyDescription,
  patternOptions,
  riskOptions,
  sortOptions,
}: {
  rows: ScannerSignal[];
  mode: "pre-breakout" | "breakout" | "breakdown" | "momentum";
  emptyDescription: string;
  patternOptions?: Array<{ label: string; value: string }>;
  riskOptions?: Array<{ label: string; value: string }>;
  sortOptions: Array<{ label: string; value: string }>;
}) {
  const [filters, setFilters] = useState<ScannerFilters>(defaultFilters);
  const sectors = ["All", ...new Set(rows.map((row) => row.sector))];
  const filtered = applyScannerFilters(rows, filters);

  return (
    <div className="space-y-6">
      <ScannerFiltersBar
        filters={filters}
        onChange={setFilters}
        signalOptions={[
          { label: "All", value: "All" },
          { label: "Very Strong", value: "Very Strong" },
          { label: "Strong", value: "Strong" },
          { label: "Watch", value: "Watch" },
          { label: "Moderate", value: "Moderate" },
        ]}
        marketCapOptions={[
          { label: "All", value: "All" },
          { label: "Large-Mid", value: "Large-Mid" },
          { label: "Small Cap", value: "Small Cap" },
          { label: "Micro Cap", value: "Micro Cap" },
        ]}
        qualityOptions={[
          { label: "All", value: "All" },
          { label: "High Base", value: "High Base" },
          { label: "Volume Confirmed", value: "Volume Confirmed" },
          { label: "Leading RS", value: "Leading RS" },
          { label: "Low Risk", value: "Low Risk" },
          { label: "High Accuracy", value: "High Accuracy" },
        ]}
        sectorOptions={sectors.map((sector) => ({ label: sector, value: sector }))}
        sortOptions={sortOptions}
        patternOptions={patternOptions}
        riskOptions={riskOptions}
      />

      {filtered.length ? (
        <ScannerTable rows={filtered} mode={mode} />
      ) : (
        <EmptyState
          title="No scanner rows found"
          description={emptyDescription}
        />
      )}
    </div>
  );
}
