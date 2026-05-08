"use client";

export function StatusBadge({
  status,
}: {
  status:
    | "Target 2 Hit"
    | "Target 1 Hit"
    | "Partial Target"
    | "Stop/Reference Breach"
    | "Expired"
    | "Invalidated"
    | "Open";
}) {
  const colors = {
    "Target 2 Hit": "bg-green-900/40 text-green-300 border-green-700",
    "Target 1 Hit": "bg-emerald-900/40 text-emerald-300 border-emerald-700",
    "Partial Target": "bg-purple-900/40 text-purple-300 border-purple-700",
    "Stop/Reference Breach": "bg-red-900/40 text-red-300 border-red-700",
    Expired: "bg-slate-700/40 text-slate-300 border-slate-600",
    Invalidated: "bg-amber-900/40 text-amber-300 border-amber-700",
    Open: "bg-blue-900/40 text-blue-300 border-blue-700",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
        colors[status]
      }`}
    >
      {status}
    </span>
  );
}

export function RiskBadge({
  tier,
}: {
  tier: "Severe" | "High" | "Moderate" | "Low";
}) {
  const colors = {
    Severe: "bg-red-900/40 text-red-300 border-red-700",
    High: "bg-amber-900/40 text-amber-300 border-amber-700",
    Moderate: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
    Low: "bg-green-900/40 text-green-300 border-green-700",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
        colors[tier]
      }`}
    >
      {tier}
    </span>
  );
}

export function SignalBadge({
  signal,
}: {
  signal: "Very Strong" | "Strong" | "Watch" | "Weak";
}) {
  const colors = {
    "Very Strong": "bg-green-900/40 text-green-300 border-green-700",
    Strong: "bg-blue-900/40 text-blue-300 border-blue-700",
    Watch: "bg-amber-900/40 text-amber-300 border-amber-700",
    Weak: "bg-slate-700/40 text-slate-300 border-slate-600",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
        colors[signal]
      }`}
    >
      {signal}
    </span>
  );
}

export function NiftyBadge({
  label,
}: {
  label: "Positive" | "Constructive" | "Neutral" | "Caution" | "Negative";
}) {
  const colors = {
    Positive: "bg-green-900/40 text-green-300 border-green-700",
    Constructive: "bg-blue-900/40 text-blue-300 border-blue-700",
    Neutral: "bg-slate-700/40 text-slate-300 border-slate-600",
    Caution: "bg-amber-900/40 text-amber-300 border-amber-700",
    Negative: "bg-red-900/40 text-red-300 border-red-700",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
        colors[label]
      }`}
    >
      {label}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  let color = "bg-slate-700/40 text-slate-300 border-slate-600";
  if (score >= 80) color = "bg-green-900/40 text-green-300 border-green-700";
  else if (score >= 65)
    color = "bg-blue-900/40 text-blue-300 border-blue-700";
  else if (score >= 50)
    color = "bg-amber-900/40 text-amber-300 border-amber-700";

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${color}`}
    >
      {score.toFixed(0)}
    </span>
  );
}
