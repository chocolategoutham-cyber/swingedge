"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/format";

const navItems = [
  { href: "/pre-breakout", label: "Screener" },
  { href: "/insights", label: "Insights" },
  { href: "/learn", label: "Learn" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState("");

  function submitSymbolSearch() {
    const normalized = searchSymbol.trim().toUpperCase();
    if (!normalized) return;
    router.push(`/stocks/${normalized}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-sm font-semibold text-cyan-200">
            SL
          </span>
          <div>
            <p className="text-sm font-semibold text-white">SignalLens</p>
            <p className="text-xs text-slate-400">NSE research workspace</p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  pathname.startsWith(item.href)
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <input
            value={searchSymbol}
            onChange={(event) => setSearchSymbol(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitSymbolSearch();
            }}
            placeholder="Search NSE stock"
            className="w-44 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            aria-label="Search NSE stock by symbol"
          />
          <button
            type="button"
            onClick={submitSymbolSearch}
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-500/20"
          >
            Open
          </button>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item.label}
              </Link>
            ))}
            <div className="rounded-xl bg-white/5 p-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500">
                Search NSE stock
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  value={searchSymbol}
                  onChange={(event) => setSearchSymbol(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSymbolSearch();
                  }}
                  placeholder="Type symbol"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                  aria-label="Search NSE stock by symbol"
                />
                <button
                  type="button"
                  onClick={submitSymbolSearch}
                  className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100"
                >
                  Open
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
