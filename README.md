# SignalLens

SignalLens is an original NSE-focused swing-trading research demo built with Next.js App Router, TypeScript, Tailwind CSS, Recharts, TanStack Table, Zod, and local mock data.

## Product scope

- Pre-breakout scanner
- Breakout scanner
- Breakdown risk scanner
- Momentum leaders
- Proof board outcome tracker
- Nifty market context
- Sector rotation and breadth insights
- Learning hub and pattern guides
- About, contact, privacy, terms, and disclaimer pages

## Principles

- Educational research software only
- No brokerage integration
- No order placement
- No buy, sell, or hold recommendations
- Mock/local data in v1 with backend-ready modules under `lib/`

## App structure

- `app/` route layer and API route handlers
- `components/` layout, scanner, chart, proof, insights, and legal UI
- `lib/data/` synthetic stock, candle, proof, Nifty, and insights data
- `lib/scanners/` indicator, structure, scanner, proof, Nifty, and insights logic

## Getting started

```bash
npm install
npm run dev
```

## Notes

- The first version uses synthetic NSE-style market data for a safe public demo.
- API routes under `app/api/` expose mock scanner and research payloads so real providers can be connected later.
- The interface and content are original and intended for responsible research education only.
