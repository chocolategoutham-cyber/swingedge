"use client";

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
import { getCandles } from "@/lib/data/mock-candles";
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

  const columns = useMemo<ColumnDef<ScannerSignal>[]>(
    () => [
      { accessorKey: "symbol", header: "Symbol" },
      { accessorKey: "companyName", header: "Company" },
      {
        id: "analyze",
        header: "Analyze",
        cell: ({ row }) => (
          <button
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100"
            onClick={() => setSelected(row.original)}
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
        signal={selected}
        candles={selected ? getCandles(selected.symbol) : []}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
