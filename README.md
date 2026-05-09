# GitHub Monitoring MVP

A production-ready **Next.js dashboard** for tracking AI repositories on GitHub, including:
- top repositories by stars
- fastest-growing repositories (7-day growth)
- curated ecosystem views (Claude CLI, Agent, Skills, MCP)

The app can refresh repository stats live via GitHub API and displays fallback/status messaging when live refresh is partially unavailable.

## Features
- Modern dashboard UI with ranked repository cards
- Live refresh endpoint: `POST /api/refresh-data`
- Health endpoint: `GET /api/health`
- Graceful handling for partial/full refresh failures
- CI workflow (lint + build) with GitHub Actions
- Scheduled uptime workflow

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + custom CSS
- **Data source:** GitHub REST API (with optional HTML fallback)

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Install
```bash
npm install
```

### Configure environment
Copy the example file:
```bash
cp .env.example .env.local
```

Set:
- `GITHUB_TOKEN` (recommended, especially for production)

### Run locally
```bash
npm run dev
```

Open: `http://localhost:3000`

## Available Scripts
- `npm run dev` — start local development server
- `npm run lint` — run ESLint
- `npm run build` — production build
- `npm run start` — start production server

## API Endpoints
- `GET /api/health`  
  Returns:
  ```json
  { "status": "ok" }
  ```
- `POST /api/refresh-data`  
  Refreshes repository snapshots and returns dashboard data (+ warning/message fields when relevant).

## Deployment (Vercel)
1. Push this repository to GitHub.
2. Import the repo in Vercel (`Add New Project`).
3. Add environment variables in **Project Settings → Environment Variables**:
   - `GITHUB_TOKEN`
4. Deploy from `main` (auto-deploy enabled for future pushes).

## Post-Deploy Smoke Test
Replace `YOUR_URL` with your Vercel domain:

```bash
curl -i https://YOUR_URL/
curl -i https://YOUR_URL/api/health
curl -i -X POST https://YOUR_URL/api/refresh-data
```

Expected:
- `/` returns `200`
- `/api/health` returns `200` and `{"status":"ok"}`
- `/api/refresh-data` returns `200` (or `503` with explicit message during upstream outage/rate limit)

## CI and Monitoring
- CI: `.github/workflows/ci.yml`
- Uptime checks: `.github/workflows/uptime-check.yml`  
  Requires GitHub Actions secret:
  - `UPTIME_URL` = your production base URL (e.g. `https://your-app.vercel.app`)

## Operational Notes
- For stable production refreshes, always configure `GITHUB_TOKEN`.
- If GitHub API is unavailable, the app keeps serving dashboard data and surfaces a clear warning/error state.

## License
Private/internal project (add a license file if you plan to open source it).
