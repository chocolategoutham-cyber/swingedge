"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { ScannerSignal } from "@/lib/types";
import { publicApiBase, type StockDetailApiResponse } from "@/lib/api";
import ScoreBadge from "@/components/common/ScoreBadge";
import RiskBadge from "@/components/common/RiskBadge";
import StockAnalyzeDrawer from "@/components/scanners/StockAnalyzeDrawer";

export default function ScannerTable({
  rows,
  mode,
}: {
  rows: ScannerSignal[];
  mode: "pre-breakout" | "breakout" | "breakdown" | "momentum";
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<ScannerSignal | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<StockDetailApiResponse | null>(null);

  async function handleAnalyze(signal: ScannerSignal) {
    setSelected(signal);
    try {
      const response = await fetch(`${publicApiBase}/api/stocks/${signal.symbol}`);
      if (!response.ok) {
        setSelectedDetail(null);
        return;
      }
      const payload = (await response.json()) as StockDetailApiResponse;
      setSelectedDetail(payload);
    } catch {
      setSelectedDetail(null);
    }
  }

  const columns = useMemo<ColumnDef<ScannerSignal>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <Link
            href={`/stocks/${row.original.symbol}`}
            className="font-semibold text-cyan-200 hover:text-cyan-100"
          >
            {row.original.symbol}
          </Link>
        ),
      },
      {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => (
          <Link
            href={`/stocks/${row.original.symbol}`}
            className="text-slate-200 hover:text-white"
          >
            {row.original.companyName}
          </Link>
        ),
      },
      {
        id: "analyze",
        header: "Analyze",
        cell: ({ row }) => (
          <button
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100"
            onClick={() => void handleAnalyze(row.original)}
          >
            Analyze
          </button>
        ),
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => <ScoreBadge score={row.original.score} />,
      },
      { accessorKey: "signalLabel", header: "Signal" },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => row.original.price.toFixed(2),
      },
      ...(mode !== "momentum"
        ? [
            {
              id: "fromPivot",
              header: "From Pivot",
              cell: ({ row }: { row: { original: ScannerSignal } }) =>
                String(row.original.metrics.fromPivot ?? "NA"),
            },
          ]
        : []),
      {
        id: "rsRank",
        header: "RS Rank",
        cell: ({ row }) => String(row.original.metrics.rsRank ?? "NA"),
      },
      {
        id: "volumeQuality",
        header: "Volume",
        cell: ({ row }) =>
          String(row.original.metrics.volumeQuality ?? row.original.metrics.volumeRatio ?? "NA"),
      },
      {
        accessorKey: "riskTier",
        header: "Risk",
        cell: ({ row }) => <RiskBadge tier={row.original.riskTier} />,
      },
      {
        id: "rsi",
        header: "RSI",
        cell: ({ row }) => String(row.original.metrics.rsi ?? "NA"),
      },
      {
        id: "adx",
        header: "ADX",
        cell: ({ row }) => String(row.original.metrics.adx ?? "NA"),
      },
      {
        id: "updatedAt",
        header: "Updated",
        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
      },
    ],
    [mode]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
        <table className="min-w-[1080px] w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-medium text-slate-300"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()?.bind(null)}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-200">
                    {cell.column.columnDef.cell
                      ? flexRender(cell.column.columnDef.cell, cell.getContext())
                      : String(cell.getValue() ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p className="text-xs leading-6 text-slate-400">
          This is educational research software only. It is not investment advice,
          trading advice, financial advice, or a recommendation to buy, sell,
          hold, short, hedge, or transact in any security.
        </p>
      </div>
      <StockAnalyzeDrawer
        detail={selectedDetail ?? (selected ? {
          stock: {
            symbol: selected.symbol,
            companyName: selected.companyName,
            sector: selected.sector,
            marketCapBucket: selected.marketCapBucket,
            exchange: "NSE",
          },
          candles: [],
          signals: [selected],
          proof: [],
          overview: {
            statusLabel: selected.scannerType,
            signalStrength: selected.signalLabel,
            setupType: selected.setupType,
            scanDate: selected.signalDate,
            latestPrice: selected.price,
            latestScore: selected.score,
            savedAppearances: 1,
            proofCount: 0,
            sector: selected.sector,
            marketCapBucket: selected.marketCapBucket,
            lastUpdated: selected.updatedAt,
            chartNote: "",
            shortlistNarrative: selected.notes,
          },
          latestSignal: selected,
          chartLevels: [],
          insightCards: [],
          stageTimeline: [],
          proofSnapshot: null,
          referenceTexts: {
            scannerSummary: selected.notes,
            chartSummary: "Loading chart context.",
          },
        } : null)}
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setSelectedDetail(null);
        }}
      />
    </>
  );
}
