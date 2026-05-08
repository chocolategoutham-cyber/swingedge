"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/format";

const items = [
  { href: "/pre-breakout", label: "Pre-Breakout" },
  { href: "/breakouts", label: "Breakouts" },
  { href: "/breakdowns", label: "Bearish" },
  { href: "/proof-board", label: "Proof Board" },
  { href: "/nifty", label: "Nifty" },
];

export default function ScannerNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm transition",
              pathname === item.href
                ? "bg-cyan-500/15 text-cyan-200"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
