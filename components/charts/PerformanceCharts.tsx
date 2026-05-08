"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PerformanceCharts({
  equityCurve,
  monthlyStats,
  returnDistribution,
  statusBreakdown,
}: {
  equityCurve: Array<{ date: string; value: number }>;
  monthlyStats: Array<{ month: string; winRate: number; closed: number }>;
  returnDistribution: Array<{ bucket: string; count: number }>;
  statusBreakdown: Array<{ name: string; value: number; color: string }>;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">Closed-signal equity curve</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="date" hide />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="rgba(56,189,248,0.25)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">Monthly win rate</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="winRate" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">Return distribution</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={returnDistribution}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="bucket" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">Outcome mix</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusBreakdown} dataKey="value" nameKey="name" outerRadius={100}>
                {statusBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
