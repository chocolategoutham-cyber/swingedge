# Swing Edge Frontend

Public frontend for a Swing Edge style stock screener.

## Live Site

- **Frontend**: https://chocolategoutham-cyber.github.io/swingedge/
- **Backend API**: https://swingedge-server.cloud-notes-api.workers.dev

## Pages

- `/pre-breakout/` — Stocks approaching breakout levels
- `/breakouts/` — Recent breakout stocks
- `/breakdowns/` — Breakdown patterns
- `/insights/` — Market insights
- `/scaner-wins/` — Historical screener wins
- `/how-we-scan-stocks/` — Methodology explainer

## Architecture

### Frontend (This Repository)
- Static HTML/CSS/JS served via GitHub Pages
- Configured to call the live Cloudflare Worker API endpoints
- See `assets/site-config.js` for API configuration

### Backend (Private Repository)
- **Repo**: https://github.com/chocolategoutham-cyber/swingedge-server
- **Deployment**: Cloudflare Workers with Wrangler
- **Endpoints**: RESTful JSON APIs for screener data
- **CORS**: Configured to allow requests from the GitHub Pages domain

## Live API Endpoints

All endpoints are served from the Cloudflare Worker:

- `GET /api/pre-breakout` — Pre-breakout stocks
- `GET /api/breakouts` — Breakout stocks
- `GET /api/breakdowns` — Breakdown stocks
- `GET /api/insights` — Market insights
- `GET /api/scanner-wins` — Historical wins
- `GET /api/universe` — Full market universe
- `GET /api/meta` — Metadata
- `GET /api/methodology` — Screener methodology

## Development

To run locally with the live Worker API:

```bash
# Install dependencies
npm install

# Start local server (optional, for development)
node server.js

# Frontend will fetch from the live Cloudflare Worker API
```

## Deployment

- **Frontend**: Pushes to `main` deploy automatically via GitHub Actions (Pages enabled)
- **Backend**: Deployed via `wrangler publish` to Cloudflare Workers

## Notes

- The design and content structure are based on publicly visible pages
- The frontend is decoupled from the backend via HTTP APIs
- The private server repo contains screener logic, market universe, and scoring methodology
- Static snapshots previously in `/api` have been removed; all data is now served live from the Worker
