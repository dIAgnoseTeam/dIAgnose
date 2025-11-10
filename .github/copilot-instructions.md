# dIAgnose – AI agent working rules

Purpose: make AI coding agents productive in this repo fast. Capture what’s true in code today (Nov 2025), not aspirations from docs.

## Big picture

- Monorepo with two apps and docs:
  - `backend/` Python Flask app (minimal API with CORS; single GET route; placeholders for routes/models).
  - `frontend/` React + Vite app (React 19), Tailwind configured, calls backend via HTTP.
  - `db/` and `resources/` hold docs/notes; `SRS.md` is system spec (reference but not source of truth for code).
- Current data flow (as implemented): `frontend/src/App.jsx` fetches `GET http://127.0.0.1:5000/primeraconexion` → backend `app/main.py` returns text. No DB code is wired yet.

## Run and dev workflows

- Frontend (Vite):
  - Dev: from `frontend/` run `npm run dev` (Vite on 5173 by default).
  - Build: `npm run build`; Preview: `npm run preview`.
  - Lint: `npm run lint` (ESLint 9). Tailwind active via `tailwind.config.js` and `index.css`.
- Backend (Flask):
  - Python 3.9+; install deps from `backend/requirements.txt`.
  - Run: `python backend/app/main.py` (starts Flask dev server on 5000, CORS enabled). No env vars required yet.
- Full-stack local: start backend first (5000), then frontend; `App.jsx` uses hardcoded `http://127.0.0.1:5000`.

## Project layout conventions

- Backend
  - Entry: `backend/app/main.py`. CORS is enabled globally.
  - Route path naming is Spanish snake-ish (`/primeraconexion`). Future routes should live in `backend/app/routes/` and be registered in `main.py`.
  - `backend/app/models/` exists but is empty; ORM/DB not set up in code despite claims in root README.
- Frontend
  - React function components. App root in `frontend/src/App.jsx`.
  - Fetch API used directly (no axios abstraction yet). Hardcoded API base URL.
  - Tailwind is present; basic config scans `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.

## Reality vs README

- Root `README.md` describes a richer architecture (Flask services, PostgreSQL, MongoDB, Socket.IO, JWT). Current codebase implements only:
  - Flask app with a single GET endpoint and CORS.
  - React app that fetches that endpoint.
- When adding features, prefer aligning with the README vision but document any new tech/deps explicitly and wire minimal vertical slices end-to-end.

## Patterns to follow (based on current code)

- Keep endpoints simple and testable from the browser (text/JSON responses). Register blueprints in `main.py` as the app grows.
- Expose API at `/:resource` under port 5000; use CORS for local dev.
- In frontend, centralize API base URL (e.g., `import.meta.env.VITE_API_URL`) to avoid hardcoding. Use `fetch` or introduce `axios` consistently.
- Use Spanish naming in user-facing text; keep code identifiers in English or consistent with existing files.

## Gotchas and tips

- There is no `.env` handling in backend; if you add config, load via environment variables or a small `config.py` and don’t commit secrets.
- `backend/app/routes/routes.py` and `backend/app/models/models.py` are placeholders—do not assume existing functions.
- Tailwind is installed; remember to import `index.css` (already done in `main.jsx`).
- If you add DB, pin dependencies in `requirements.txt` and include minimal migration/setup notes in `backend/README.md`.

## Example tasks for agents

- Add JSON endpoint `/status` in Flask and consume it in React:
  - Backend: define route in `main.py` (or new blueprint) returning `{ ok: true, time: <iso> }`.
  - Frontend: read `import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000'` and render status.
- Replace hardcoded URL with `VITE_API_URL`; add `frontend/.env.example`.

## References

- Key files: `backend/app/main.py`, `frontend/src/App.jsx`, `frontend/package.json`, `backend/requirements.txt`, `SRS.md`.
- Open issues/notes: `resources/proceedings/*` for meeting decisions.
