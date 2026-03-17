# Deploy to Vercel (single deployment)

This repo deploys the Vite React frontend and a small backend as Vercel Serverless Functions.

## Note about `backend/` (Flask)

The original Flask backend in `backend/` is **not used** in the Vercel deployment. The deployed API lives in `api/`.

## Routes

- Frontend: `/`
- API health check: `/api/health`
- DNA scan endpoint: `POST /api/scan`

### Example request

```json
{ "organ": "liver", "dna": "ATGTTAGACTA" }
```

## Deploy

1. Push this repository to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Framework preset: **Vite** (or leave default).
4. **Root Directory**: keep as the repo root.

Vercel will read `vercel.json` and build the frontend + functions.

## Local dev

- Frontend: run Vite normally from `frontend/`
- API: use Vercel CLI (`vercel dev`) from repo root if you want the `/api/*` routes locally.
