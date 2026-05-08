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
import type { ProofRecord } from "@/lib/types";
import StatusBadge from "@/components/common/StatusBadge";
import RiskBadge from "@/components/common/RiskBadge";
import ProofDetailDrawer from "@/components/proof/ProofDetailDrawer";

export default function ProofBoardTable({ records }: { records: ProofRecord[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<ProofRecord | null>(null);

  const columns = useMemo<ColumnDef<ProofRecord>[]>(
    () => [
      { accessorKey: "symbol", header: "Symbol" },
      { accessorKey: "companyName", header: "Company" },
      { accessorKey: "scannerSource", header: "Scanner Source" },
      { accessorKey: "setupType", header: "Setup Type" },
      { accessorKey: "firstSeenDate", header: "First Seen Date" },
      { accessorKey: "entryReference", header: "Entry Reference" },
      { accessorKey: "stopReference", header: "Stop Reference" },
      { accessorKey: "target1", header: "Target 1" },
      { accessorKey: "target2", header: "Target 2" },
      { accessorKey: "currentPrice", header: "Current/Exit" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "returnPct", header: "Return %" },
      { accessorKey: "holdingDays", header: "Holding Days" },
      { accessorKey: "originalScore", header: "Original Score" },
      {
        accessorKey: "riskTier",
        header: "Risk Tier",
        cell: ({ row }) => <RiskBadge tier={row.original.riskTier} />,
      },
      {
        id: "view",
        header: "View Proof",
        cell: ({ row }) => (
          <button
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100"
            onClick={() => setSelected(row.original)}
          >
            View Proof
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: records,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
        <table className="min-w-[1400px] w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-medium text-slate-300">
                    {header.isPlaceholder ? null : (
                      <button onClick={header.column.getToggleSortingHandler()?.bind(null)}>
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
              <tr key={row.id} className="border-b border-white/5">
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
      <p className="mt-4 text-xs leading-6 text-slate-400">
        This is educational research software only. It is not investment advice,
        trading advice, financial advice, or a recommendation to buy, sell, hold,
        short, hedge, or transact in any security.
      </p>
      <ProofDetailDrawer record={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
}
