import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-20">
      <div className="panel text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Not Found</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">That research page is unavailable</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          The route may have moved, the symbol may not exist in the mock universe, or the page has not been generated yet.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-medium text-slate-950">
            Back to home
          </Link>
          <Link href="/pre-breakout" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200">
            Open scanners
          </Link>
        </div>
      </div>
    </main>
  );
}
