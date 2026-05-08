# Naming

Help founders name their projects: **FastAPI** backend + **Vite/React** frontend, **Supabase** for auth and data.

| Area | Stack |
|------|--------|
| Frontend | Vite 5, React 18, TypeScript, Supabase JS client |
| Backend | FastAPI, Uvicorn |
| Data / auth | Supabase (Postgres + Auth + RLS) |

**License:** [MIT](LICENSE). **Contributing:** see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## Quick start (local, &lt; 30 min)

**Requirements:** Python 3.11+, Node.js 20+, npm, a [Supabase](https://supabase.com) project (free tier is fine).

1. **Clone and install**

   ```bash
   git clone <your-fork-or-repo-url> naming
   cd naming
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env: VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   cd ..
   ```

3. **Backend**

   ```bash
   cd backend
   python -m venv .venv
   # Windows: .\.venv\Scripts\Activate.ps1
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Supabase**

   - **Project Settings → API:** copy Project URL and `anon` **public** key into `frontend/.env`.
   - **Authentication → URL Configuration:** add redirect URLs for dev, e.g. `http://localhost:5173` and `http://127.0.0.1:5173`. Add your **Vercel preview/production** URL when you deploy.
   - **SQL Editor:** run migrations under `supabase/migrations/` in order (e.g. `001_projects.sql`) so tables and RLS exist.

5. **Run the app**

   From repo root:

   ```bash
   npm run dev
   ```

   Open http://127.0.0.1:5173 — the UI expects the API at `VITE_API_URL` (default `http://127.0.0.1:8000`).

6. **Healthcheck**

   ```bash
   curl -s http://127.0.0.1:8000/health
   # {"status":"ok"}
   ```

---

## Monorepo layout

```
naming/
  frontend/          # Vite app (see frontend/.env.example)
  backend/           # FastAPI (see backend/.env.example)
  supabase/migrations/
  .github/workflows/ # CI (frontend build + backend pytest)
```

---

## CI

GitHub Actions runs on every push/PR to `main`/`master`:

- **Frontend:** `npm ci` + `npm run build` (TypeScript + Vite).
- **Backend:** `pytest` (includes `/health` test).

---

## Deploy (preview / production)

- **Frontend (e.g. Vercel):** set the same env vars as `frontend/.env` (`VITE_*`). Build command: `cd frontend && npm install && npm run build`, output directory: `frontend/dist`.
- **API:** host the FastAPI app (Railway, Fly.io, your VM, etc.) and point `VITE_API_URL` at the public API URL. **CORS:** extend `allow_origins` in `backend/app/main.py` (or env-driven list) to include your Vercel domain.
- **Supabase:** one dev/staging project is enough to start; use the same anon key in the frontend build env. RLS policies live in `supabase/migrations/`.

---

## Sprint 1 checklist (product)

| ID | Status | Notes |
|----|--------|--------|
| US1.1 Landing + CTA | Done | Hero, steps, FAQ, CTAs on `/` |
| US1.2 Sign up / login | Partial | Email + password via Supabase. **OAuth:** enable providers in Supabase Dashboard; UI buttons not added yet (add Google/GitHub calls to `signInWithOAuth` in a follow-up). |
| US1.3 Monorepo docs + env examples | Done | This README, `frontend/.env.example`, `backend/.env.example` |
| US1.4 CI | Done | `.github/workflows/ci.yml` |
| US1.5 Supabase + RLS | Partial | Run SQL migrations; set env on Vercel/host yourself |
| US1.6 App layout / nav | Done | Header + routes (English copy: Home, Studio, Projects when authed, Blog, Settings) |
| US1.7 README + CONTRIBUTING + CoC | Done | This file + CONTRIBUTING + CODE_OF_CONDUCT |
| US1.8 LICENSE | Done | MIT in repo root |

**Deliverable:** deploy frontend + API with healthcheck + Supabase linked — follow **Deploy** above once your hosting is chosen.

---

## API

- Docs: `GET /docs` when the server is running.
- Health: `GET /health` → `{"status":"ok"}`.
