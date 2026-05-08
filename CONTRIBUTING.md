# Contributing

Thanks for your interest in Naming. This project uses a small monorepo:

- `frontend/` — Vite + React + TypeScript (Supabase Auth client).
- `backend/` — FastAPI (`/health`, future generation APIs).
- `supabase/migrations/` — SQL for Postgres (run in the Supabase SQL Editor or via CLI).

## Getting started

1. Clone the repo and follow the root **README.md** (Python 3.11+, Node 20+, env files).
2. Run the frontend and backend locally and confirm `GET /health` on the API.
3. Apply SQL migrations in your Supabase project before testing auth- or data-dependent flows.

## Pull requests

- Open PRs against the default branch; keep changes focused and described in the PR text.
- CI runs on each PR (frontend build / TypeScript, backend tests). Ensure checks pass.
- Prefer conventional commit-style messages when it helps reviewers (e.g. `feat:`, `fix:`, `docs:`).

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## License

By contributing, you agree your contributions are licensed under the [MIT License](LICENSE).
