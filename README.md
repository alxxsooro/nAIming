# Naming

Help founders name their projects (FastAPI backend + Vite frontend).

## Requirements

- Python 3.11+
- Node.js 20+ and npm

## Frontend

From the repo root (after `npm install` in `frontend/` the first time):

```bash
cd frontend
npm install
cd ..
npm run dev
```

Open http://127.0.0.1:5173 and verify API health (backend must be running).

Copy `frontend/.env.example` to `frontend/.env` and set:

- `VITE_API_URL` — FastAPI URL (default local: `http://127.0.0.1:8000`).
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Supabase **Project Settings → API** (use the **anon public** key).

In Supabase, under **Authentication → URL Configuration**, add redirect URLs: `http://localhost:5173` and `http://127.0.0.1:5173`.

Initial SQL (`profiles` table + RLS): see `supabase/migrations/001_profiles.sql` if present and run it in the project **SQL Editor**.

## API (backend)

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Interactive docs: http://127.0.0.1:8000/docs
- Health: `GET http://127.0.0.1:8000/health`

## License

TBD.
