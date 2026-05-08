"use client";

import type { ScannerFilters } from "@/lib/types";

type Option = { label: string; value: string };

export default function ScannerFilters({
  filters,
  onChange,
  signalOptions,
  marketCapOptions,
  qualityOptions,
  sectorOptions,
  sortOptions,
  patternOptions,
  riskOptions,
}: {
  filters: ScannerFilters;
  onChange: (value: ScannerFilters) => void;
  signalOptions: Option[];
  marketCapOptions: Option[];
  qualityOptions: Option[];
  sectorOptions: Option[];
  sortOptions: Option[];
  patternOptions?: Option[];
  riskOptions?: Option[];
}) {
  const update = (key: keyof ScannerFilters, value: string | boolean) =>
    onChange({ ...filters, [key]: value });

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white";

  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:grid-cols-4">
      <input
        className={fieldClass}
        value={filters.search}
        onChange={(event) => update("search", event.target.value)}
        placeholder="Search symbol or company"
      />
      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={filters.watchlistOnly}
          onChange={(event) => update("watchlistOnly", event.target.checked)}
        />
        Watchlist only
      </label>
      <select className={fieldClass} value={filters.signal} onChange={(event) => update("signal", event.target.value)}>
        {signalOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <select className={fieldClass} value={filters.marketCap} onChange={(event) => update("marketCap", event.target.value)}>
        {marketCapOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <select className={fieldClass} value={filters.quality} onChange={(event) => update("quality", event.target.value)}>
        {qualityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <select className={fieldClass} value={filters.sector} onChange={(event) => update("sector", event.target.value)}>
        {sectorOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {patternOptions ? (
        <select className={fieldClass} value={filters.pattern} onChange={(event) => update("pattern", event.target.value)}>
          {patternOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : null}
      {riskOptions ? (
        <select className={fieldClass} value={filters.riskTier} onChange={(event) => update("riskTier", event.target.value)}>
          {riskOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : null}
      <select className={fieldClass} value={filters.sortBy} onChange={(event) => update("sortBy", event.target.value)}>
        {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
