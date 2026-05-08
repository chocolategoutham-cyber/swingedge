# Swing Edge Replica Frontend

This repository is the public frontend for a Swing Edge style screener.

## Pages

- `/scaner-wins/`
- `/pre-breakout/`
- `/breakouts/`
- `/breakdowns/`
- `/insights/`
- `/how-we-scan-stocks/`

## Notes

- The design and content structure are based on publicly visible pages.
- The public GitHub Pages site reads from static JSON snapshots stored in `/api`.
- The private screener backend is kept out of this repo and can live in a separate private repository.

## GitHub Pages

This repo includes:

- `.github/workflows/deploy-pages.yml`
- `.nojekyll`
- static API snapshots in `/api`

Pushing to `main` deploys the static site through GitHub Actions once Pages is enabled for the repository.

## Private server

A separate local package is prepared under `server-private/` for the private screener server repo. That package is git-ignored here so it does not get published with the frontend.

The private server contains:

- the Node API layer
- the methodology-driven analyzer
- the sample market universe and scoring logic
