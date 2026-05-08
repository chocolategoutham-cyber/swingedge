# Swing Edge Replica Frontend

This project is a full-stack multi-page replica inspired by `https://www.swingedge.info/`.

## Pages

- `/scaner-wins/`
- `/pre-breakout/`
- `/breakouts/`
- `/breakdowns/`
- `/insights/`
- `/how-we-scan-stocks/`

## Notes

- The design and content structure are based on publicly visible pages.
- The original site’s private scanner formulas, rankings, and backend jobs are not included.
- This version includes a lightweight Node backend with JSON APIs.
- The backend logic is inferred from the public methodology page and implemented as a transparent heuristic rules engine.

## Backend logic

The backend uses the public concepts disclosed on the reference site:

- liquidity-aware universe filtering
- stage and trend alignment
- relative strength
- breakout proximity
- volume dry-up and breakout participation
- failure-risk and bearish structure checks

These are implemented in:

- `lib/analyzer.js`
- `data/market-universe.js`
- `data/site-data.js`

## Run

```bash
node server.js
```

Then open `http://localhost:3000`.
