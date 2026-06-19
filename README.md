# DevQuiz — AI Frontend Interview Questions Platform

A full-stack app to generate, share, and discover frontend interview questions
using a **free, local LLM (Ollama)** — no paid API keys required. For
production deployments where you can't run a local LLM (e.g. Render's free
tier), it falls back to a free hosted model via Groq, and finally to a static
sample question bank if neither is reachable.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express
- **Database:** SQLite via `better-sqlite3` (zero setup, auto-created file)
- **AI:** [Ollama](https://ollama.com) running `llama3` locally
- **Auth:** JWT (no third-party auth provider)

> **Future plan:** the backend currently persists to SQLite for simplicity. A
> MongoDB connection string can be dropped into `server/.env` (`MONGODB_URI`)
> later to swap in MongoDB as the primary datastore — the route layer is
> structured so the data-access calls in `server/db.js` can be swapped out
> without touching route logic.

## Demo Credentials

| Role  | Email               | Password   |
|-------|----------------------|------------|
| Admin | admin@devquiz.com    | Admin@123  |
| User  | john@devquiz.com     | User@123   |
| User  | jane@devquiz.com     | User@123   |

The database is seeded automatically on first run with these 3 users and
75 sample interview questions (5 categories × 3 levels × 5 questions).

## Project Structure

```
/client   → React frontend (Vite)
/server   → Express backend + SQLite (db.sqlite is auto-created)
README.md → this file
```

## Setup

### 1. Install Ollama (free local AI)

```bash
# install from https://ollama.com, then:
ollama pull llama3
ollama serve
```

Ollama must be running at `http://localhost:11434` for live AI generation.
**If Ollama is offline, the app automatically falls back to a bundled set of
75 pre-written sample questions** (see `server/data/fallbackQuestions.json`)
and shows a friendly message:

> "Local AI is offline. Please run: ollama serve"

### 2. (Optional) Add a free cloud AI fallback for production

Ollama only works where it's installed and running — on a host like Render's
free tier (512MB RAM) you can't run a local LLM at all. As a free fallback for
production, the backend will use [Groq](https://console.groq.com)'s free API
if Ollama isn't reachable:

1. Create a free account at https://console.groq.com and generate an API key
2. Set `GROQ_API_KEY=<your key>` in `server/.env` (locally) or in your hosting
   provider's environment variables (e.g. Render's dashboard)

If `GROQ_API_KEY` is left blank, this step is skipped entirely and the app
falls straight through to the static sample question bank — no errors, no
cost, just fewer unique questions.

**Generation order:** local Ollama → Groq (if key set) → static fallback bank.

### 3. Install dependencies

From the project root:

```bash
npm run setup
```

This installs dependencies for both `/client` and `/server`.

### 4. Run the app

```bash
npm run dev
```

This starts:
- the Express API on `http://localhost:5000`
- the Vite dev server on `http://localhost:5173` (proxies `/api` to the backend)

Open `http://localhost:5173` and log in with one of the demo accounts above.

## Features

- 🔐 JWT auth (login/register), protected routes
- 📊 Dashboard with stats (total questions, by category, by level, community posts)
- ✨ AI Question Generator — pick category / level / count, calls local Ollama,
  preview + edit before posting, with offline fallback questions
- 🌍 Community feed — search, filter by category/level/tag, upvote, bookmark
- 📝 My Questions — edit/delete your own posts, draft vs published
- 🔖 Bookmarks — your saved questions
- 🏆 Leaderboard — top contributors by question count & upvotes
- 🌗 Dark mode by default with a light mode toggle, glassmorphism UI,
  Framer Motion page/card animations, toast notifications

## Environment Variables (`server/.env`)

```
PORT=5000
JWT_SECRET=devquiz_super_secret_change_me
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3

# Optional free cloud fallback for production (see Setup step 2 above)
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
```

## Deploying (Vercel/Netlify + Render)

- **Frontend** → Vercel or Netlify, pointing at `/client`. Set the build's API
  base URL (or your Vite proxy / env var) to your deployed backend's URL.
- **Backend** → Render, pointing at `/server`. Render's free tier can run the
  Express + SQLite app fine, but **cannot run Ollama** — set `GROQ_API_KEY` in
  Render's environment variables if you want live AI generation in
  production; otherwise the app gracefully serves fallback sample questions.
- SQLite's `db.sqlite` file lives on the server's local disk — on Render's
  free tier this disk is **ephemeral** (wiped on redeploy/restart), so any
  posted questions will reset. For persistent production data, plan to swap
  in MongoDB (see the note above) or use a Render persistent disk.
