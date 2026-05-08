"use client";

import { useState } from "react";
import { isAfter, subDays, subYears } from "date-fns";
import type { ProofFilters, ProofRecord } from "@/lib/types";
import ProofBoardTable from "@/components/proof/ProofBoardTable";
import EmptyState from "@/components/common/EmptyState";

const defaultFilters: ProofFilters = {
  search: "",
  scannerSource: "All",
  status: "All",
  timeRange: "All",
  marketCap: "All",
  sector: "All",
  riskTier: "All",
  sortBy: "returnPct",
  sortDirection: "desc",
};

function filterProofRecords(records: ProofRecord[], filters: ProofFilters) {
  const cutoff =
    filters.timeRange === "7D"
      ? subDays(new Date(), 7)
      : filters.timeRange === "30D"
        ? subDays(new Date(), 30)
        : filters.timeRange === "90D"
          ? subDays(new Date(), 90)
          : filters.timeRange === "1Y"
            ? subYears(new Date(), 1)
            : null;

  return records
    .filter((record) => {
      const searchHit =
        !filters.search ||
        record.symbol.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.companyName.toLowerCase().includes(filters.search.toLowerCase());
      const sourceHit = filters.scannerSource === "All" || record.scannerSource === filters.scannerSource;
      const statusHit = filters.status === "All" || record.status === filters.status;
      const capHit = filters.marketCap === "All" || record.marketCapBucket === filters.marketCap;
      const sectorHit = filters.sector === "All" || record.sector === filters.sector;
      const riskHit = filters.riskTier === "All" || record.riskTier === filters.riskTier;
      const timeHit = !cutoff || isAfter(new Date(record.firstSeenDate), cutoff);
      return searchHit && sourceHit && statusHit && capHit && sectorHit && riskHit && timeHit;
    })
    .sort((left, right) => {
      const direction = filters.sortDirection === "desc" ? -1 : 1;

      if (filters.sortBy === "firstSeenDate") {
        return direction * (new Date(right.firstSeenDate).getTime() - new Date(left.firstSeenDate).getTime());
      }

      const getNumericValue = (record: ProofRecord) => {
        if (filters.sortBy === "returnPct") return record.returnPct;
        if (filters.sortBy === "originalScore") return record.originalScore;
        if (filters.sortBy === "holdingDays") return record.holdingDays;
        return 0;
      };

      return direction * (getNumericValue(right) - getNumericValue(left));
    });
}

export default function ProofBoardClient({ records }: { records: ProofRecord[] }) {
  const [filters, setFilters] = useState(defaultFilters);
  const sectors = ["All", ...new Set(records.map((record) => record.sector))];
  const filtered = filterProofRecords(records, filters);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:grid-cols-4">
        <input
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
          placeholder="Search"
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        />
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.scannerSource} onChange={(event) => setFilters({ ...filters, scannerSource: event.target.value })}>
          {["All", "pre-breakout", "breakout", "breakdown", "momentum"].map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          {["All", "Open", "Target 2 Hit", "Partial Target", "Stop/Reference Breach", "Expired", "Invalidated"].map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.timeRange} onChange={(event) => setFilters({ ...filters, timeRange: event.target.value as ProofFilters["timeRange"] })}>
          {["All", "7D", "30D", "90D", "1Y"].map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.marketCap} onChange={(event) => setFilters({ ...filters, marketCap: event.target.value })}>
          {["All", "Large-Mid", "Small Cap", "Micro Cap"].map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.sector} onChange={(event) => setFilters({ ...filters, sector: event.target.value })}>
          {sectors.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.riskTier} onChange={(event) => setFilters({ ...filters, riskTier: event.target.value })}>
          {["All", "Low", "Moderate", "High", "Severe"].map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" value={filters.sortBy} onChange={(event) => setFilters({ ...filters, sortBy: event.target.value })}>
          {[
            ["returnPct", "Return"],
            ["firstSeenDate", "Date"],
            ["originalScore", "Score"],
            ["holdingDays", "Holding Days"],
          ].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      {filtered.length ? (
        <ProofBoardTable records={filtered} />
      ) : (
        <EmptyState
          title="No proof records matched"
          description="Try a wider time range or reset the source/status filters."
        />
      )}
    </div>
  );
}
