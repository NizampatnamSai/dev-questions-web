"""
Single source of truth describing what Dev Life is and does — feeds both the
Admin "Features & Docs" page and the in-app Project Chatbot's system prompt.
Update this file whenever a feature ships so both surfaces (and the chatbot's
answers) stay accurate without hand-editing multiple places.
"""

PROJECT_SUMMARY = (
    "Dev Life is a developer learning platform (web app + mobile app) covering interview questions, "
    "AI-assisted study tools, developer utilities (compilers, testers, generators), a personal encrypted "
    "notes system, team features like a daily Work Board, and an admin control panel for managing users, "
    "content, and app-wide settings."
)

GUEST_ALLOWED_ROUTES = [
    "/dashboard", "/community", "/js-compiler", "/json-parser", "/regex-tester",
    "/cron-builder", "/jwt-decoder", "/study", "/api-tester", "/background-remover",
    "/devtools", "/meetings",
]

# High-level explainer of how the Python backend works overall — written for a
# frontend-leaning audience who knows web concepts but not necessarily FastAPI/
# Python backend patterns specifically. Doubles as light interview prep.
PYTHON_ARCHITECTURE = {
    "overview": (
        "The backend is a single FastAPI application (server/main.py) — one Python process handling every "
        "API route, not separate microservices. FastAPI is a modern Python web framework built specifically "
        "for building APIs: you write a Python function, decorate it with the HTTP method and path "
        "(@router.get('/users/{id}')), and FastAPI handles routing, request parsing, validation, and turning "
        "the return value into a JSON response automatically. It runs on Uvicorn, an ASGI server (ASGI is "
        "Python's async equivalent of Node's http server) — this is what actually accepts TCP connections "
        "and hands requests to FastAPI."
    ),
    "async_await": (
        "Almost every route function is declared `async def`, and every database call is `await`ed. This "
        "matters for the same reason it matters in JavaScript: while one request is waiting on a slow I/O "
        "operation (a database query, an external API call to Groq/Cloudinary/Jitsi), Python's event loop is "
        "free to work on other requests instead of sitting idle — one process can genuinely handle many "
        "concurrent requests as long as they're mostly waiting on I/O rather than doing heavy CPU work. This "
        "is conceptually identical to Node's event loop, just Python's version of the same idea (asyncio)."
    ),
    "pydantic_validation": (
        "Request bodies are defined as Pydantic models — Python classes with typed fields, e.g. `class "
        "LoginBody(BaseModel): email: str; password: str`. FastAPI uses this to automatically validate "
        "incoming JSON against the expected shape and types before your route function even runs — if a "
        "required field is missing or the wrong type, the client gets a clear 422 error automatically, no "
        "manual validation code needed. This is the Python equivalent of using Zod/Yup schemas on a Node API, "
        "except it's built into the framework itself rather than a separate library choice."
    ),
    "dependency_injection": (
        "FastAPI's `Depends()` is used everywhere for authentication: a route declares `user=Depends"
        "(current_user)`, and FastAPI automatically runs the `current_user` function first — it reads the "
        "Authorization header, decodes the JWT, looks up the user in MongoDB, and either returns the user "
        "object (injected as the `user` parameter) or raises a 401 before the route body ever executes. This "
        "is why almost no route in this codebase manually checks 'is this user logged in' — the dependency "
        "does it once, consistently, for every protected route. Admin-only routes add a second dependency "
        "(`_require_admin`) that itself depends on `current_user` and additionally checks the role."
    ),
    "mongodb_motor": (
        "The database is MongoDB, accessed via Motor — the async driver for MongoDB in Python (the sync "
        "driver, pymongo, would block the event loop on every query, defeating the whole point of using "
        "async). Every collection is accessed through a small helper function in db_mongo.py (col_users(), "
        "col_notes(), etc.) rather than hardcoding collection names everywhere, so a rename or a switch to a "
        "different database only needs to change one place. Documents are plain Python dicts; ObjectIds "
        "(Mongo's unique ID type) get converted to strings for JSON responses via a small `sid()` helper."
    ),
    "jwt_auth_flow": (
        "Login issues a JWT (JSON Web Token) — a signed token containing the user's ID, created with a "
        "secret key only the server knows. The client stores this token and sends it in the Authorization "
        "header on every request; the server verifies the signature and decodes the user ID without needing "
        "a database lookup for signature validation itself (though the current implementation does still "
        "look up the full user document to check current role/status, since permissions can change after a "
        "token was issued). No server-side session storage is needed for basic identity — the token itself "
        "carries it, verified cryptographically."
    ),
    "background_jobs": (
        "Scheduled tasks (WorkBoard reminders, weekly notifications, the community reminder) run via "
        "APScheduler, a Python library for cron-style scheduled jobs running inside the same process as the "
        "web server. Admin-configured times (stored in MongoDB) are converted from IST to UTC at startup and "
        "whenever an admin changes them, and the relevant job is rescheduled live via `scheduler.reschedule_"
        "job(...)` — no server restart needed for a time change to take effect."
    ),
    "websockets": (
        "Real-time features (the notification bell's live unread count) use FastAPI's native WebSocket "
        "support — a persistent, two-way connection instead of the request/response model of normal HTTP. "
        "The server keeps a dictionary of open connections per user ID and pushes a message directly down "
        "the socket when something relevant happens (a new notification), rather than the client needing to "
        "poll repeatedly asking 'anything new?'."
    ),
    "ai_integration": (
        "AI features call Groq's API (an OpenAI-compatible chat completions endpoint) via direct HTTP calls "
        "using httpx (Python's modern async-capable requests library) — there's no heavy AI framework "
        "involved, just a prompt string sent to `/chat/completions` and the response text parsed back "
        "(often expected as JSON, extracted from the model's raw text output). A second, smaller model is "
        "used as an automatic fallback if the primary model is rate-limited (HTTP 429)."
    ),
    "deployment": (
        "In production, Uvicorn runs the FastAPI app on Render (a hosting platform), with environment "
        "variables (database URLs, API keys) injected via Render's dashboard rather than committed to code. "
        "The same codebase runs locally during development (`python run.py`) and in production — no separate "
        "'production build' step exists for the backend the way there is for the frontend, since Python is "
        "interpreted, not compiled/bundled."
    ),
}

# path -> {label, desc, audience, python}
# `python` = concrete backend implementation notes: which router file, which
# libraries, what the actual endpoint(s) look like — not just "it's an API".
ROUTES = {
    "/dashboard": {
        "label": "Dashboard", "audience": "all",
        "desc": "Home screen with quick stats and shortcuts.",
        "python": "Aggregates data from several routers (questions, stats, gamification) via separate GET calls the frontend fires in parallel — no single 'dashboard' backend endpoint; it's a composition of existing ones.",
    },
    "/workboard": {
        "label": "Work Board", "audience": "user",
        "desc": "Daily standup-style posts; admin sets reminder times. Members marked on leave (Profile → Settings) are silently skipped by both reminders — no nag for a day they're not expected to post.",
        "python": "routers/workboard.py for the posts themselves. Reminder times are stored in MongoDB (col_app_config), converted from IST to UTC at server startup and scheduled with APScheduler; admin changes call scheduler.reschedule_job(...) live, no restart needed. The actual reminder jobs (scheduler_tasks.py: fire_workboard_notifications, fire_workboard_afternoon_reminder) skip any member for whom utils/leaves.is_user_on_leave(userId, today) is true. The 30-minute edit window is enforced server-side by comparing the post's stored createdAt (UTC) against datetime.now(timezone.utc).",
    },
    "/community": {
        "label": "Community", "audience": "all",
        "desc": "Public interview-question feed with a weekday posting rotation — only the day's assigned person (or admin, any day) can post. Saturday is admin-only, and only on an 'even' Saturday (the 2nd or 4th of the month) — odd Saturdays are closed, same as Sunday. The reminder for the day's poster checks whether they've actually posted yet (no nag if they already have) and, if they're on leave that day, redirects the reminder to admins to cover the post instead of pinging someone who's out. Each question card also supports emoji reactions (👍 ❤️ 😂 🎉 😮 👀, one fixed set — not a freeform picker) alongside the existing upvote/highlight/bookmark actions.",
        "python": "routers/questions.py handles posting + the rotation gate (get_community_allowed_email(), checked in create()); col_community_schedule stores the per-weekday assignee plus the admin-configurable reminder time (default 3:00 PM IST). The even/odd Saturday check (_is_even_saturday(): week_number = (day-1)//7+1, even if that's 2 or 4) gates both the posting permission and the scheduler_tasks.py reminder job the same way, so the feed and the push notification never disagree about whether today is open. The reminder job itself (fire_community_reminder) checks col_questions for a post from today's assignee before sending anything, checks utils/leaves.is_user_on_leave() to redirect to admins instead of the assignee when they're out, and CCs admins with a 'reminder sent' notification when it does ping the assignee. Reactions (POST /questions/{id}/react) store a `reactions: {emoji: [userIds]}` dict on the question doc, toggled via $addToSet/$pull exactly like the existing upvote field — _ser() serializes it down to {emoji: count} plus the caller's own myReactions list.",
    },
    "/ask": {
        "label": "Ask AI", "audience": "user",
        "desc": "General-purpose AI chat for any dev question (with saved history), plus a Prompt Improver mode, an image-understanding mode, a text-to-image Create mode, a Humanize mode that rewrites pasted AI-generated text to sound more natural, and a Diagram mode that turns a plain-English project/system description into an actual rendered diagram — all as tabs on the same page.",
        "python": "routers/ask.py. POST /ai/ask sends {system prompt + question} to Groq's chat completions endpoint via httpx, falls back to a smaller model on 429. Chat history is just Mongo documents (col_ai_history) with a messages array — no vector DB or embedding search involved, purely a saved transcript. POST /ai/humanize uses the same Groq call with a different system prompt tuned to cut generic AI phrasing/filler while preserving meaning and length; capped at 1000 words server-side, matching the UI's word counter. POST /ai/diagram asks Groq for a Mermaid.js flowchart definition (strips accidental ```mermaid code fences from the response), which the frontend renders client-side into an actual SVG diagram via the mermaid npm package — no diagramming happens server-side, the AI only produces the text description of the diagram.",
    },
    "/js-coding": {
        "label": "JS Coding Questions", "audience": "user",
        "desc": "AI generates a unique JS coding problem, graded by actually running your code in a sandboxed V8 engine against real test cases (not AI guessing).",
        "python": "routers/coding_questions.py + utils/js_sandbox.py, using mini-racer (a Python binding for Google's V8 engine). Each test case runs in a fresh MiniRacer() context with no shared state; the AI-generated model answer is itself run through the same sandbox at generation time, and generation retries (bounded) if the model answer doesn't pass its own test cases — this is what guarantees a 'passed' result is actually meaningful.",
    },
    "/generate": {
        "label": "AI Generator", "audience": "user",
        "desc": "Generates fresh interview questions by category/difficulty.",
        "python": "routers/questions.py calling utils/ai.py's generate_questions(), which tries a local Ollama model first (if configured), falls back to Groq, and falls back again to a static JSON question bank (data/fallbackQuestions.json) if both AI calls fail — three-tier fallback so the feature never returns a hard error to the user.",
    },
    "/my-tasks": {
        "label": "My Tasks / Task Manager", "audience": "user",
        "desc": "Personal task tracker (My Tasks for assignees, Task Manager for admins). Any assignee of a non-completed task due today gets an automatic reminder notification at an admin-configurable time (default 5:00 PM IST). Moving/updating a task's status shows an inline 'Moving…' spinner directly on the card (not just a toast), so the state stays visible even if the toast is missed. Admins can also schedule a task for deferred creation — it doesn't exist or notify assignees until a picked future date/time, chosen via a custom in-app date-time picker (with an explicit OK/Cancel, unlike the native browser picker it replaced) rather than a due date on an already-existing task.",
        "python": "routers/tasks.py — plain CRUD against col_tasks(), status field constrained to a fixed set of stage strings (todo/started/completed etc.), migrated once at startup from an older 3-stage scheme via a one-time, idempotent update_many() in db_mongo.py's init_mongo(). The due-date reminder itself is a separate APScheduler job (scheduler_tasks.py: fire_task_due_date_reminders), querying col_tasks() for dueDate == today and status != completed, then notifying every assignee who hasn't personally completed it yet. Scheduled tasks live in a separate col_scheduled_tasks() until their time arrives; a per-minute job (fire_scheduled_tasks) atomically claims each due doc via find_one_and_delete() before creating the real task — needed after a duplicate-task bug where two overlapping scheduler ticks (e.g. old + new instance both alive during a zero-downtime deploy) could otherwise both fire the same scheduled doc.",
    },
    "/json-parser": {
        "label": "JSON Parser", "audience": "all",
        "desc": "Format/validate/explore JSON.",
        "python": "No backend involved at all — entirely client-side JavaScript (JSON.parse + a tree renderer). Listed here for completeness, not because Python does anything for it.",
    },
    "/js-compiler": {
        "label": "JS Compiler", "audience": "all",
        "desc": "Runs JavaScript safely in a sandboxed browser context (an isolated iframe/worker) — nothing you run here can touch the real page or make network calls beyond what you write.",
        "python": "No backend execution — code runs via the browser's own `new Function(code)` in JsCompiler.jsx, entirely client-side. The only backend involvement is the optional 'Ask AI to Explain' button, which sends your code + output to the same /ai/ask endpoint Ask AI uses.",
    },
    "/regex-tester": {
        "label": "Regex Tester", "audience": "all",
        "desc": "Live regex match/replace testing.",
        "python": "Client-side only (JavaScript's native RegExp) — no backend endpoint.",
    },
    "/cron-builder": {
        "label": "Cron Builder", "audience": "all",
        "desc": "Build and explain cron expressions in plain English.",
        "python": "Client-side parsing/explanation logic — no backend endpoint, even though the app's own scheduled jobs (WorkBoard reminders etc.) do use real Python cron scheduling via APScheduler elsewhere.",
    },
    "/jwt-decoder": {
        "label": "JWT Decoder", "audience": "all",
        "desc": "Decodes JWT header/payload client-side — never sends your token anywhere.",
        "python": "No backend call — base64-decodes the header/payload segments in the browser. Notably, the app's OWN JWTs (from login) are created and verified server-side in auth_utils.py using the `jose` library, which this tool has nothing to do with.",
    },
    "/api-tester": {
        "label": "API Tester", "audience": "all",
        "desc": "A lightweight Postman: send requests to any public API through our CORS-free proxy. Also includes the Mock API Generator for instant dummy-data endpoints.",
        "python": "The proxy endpoint (routers/dev_tools.py) uses httpx server-side to make the actual request (since the browser's CORS restrictions don't apply to server-to-server calls), with basic SSRF protection — it validates the target isn't a private/internal IP before making the request.",
    },
    "/snippets": {
        "label": "Snippet Library", "audience": "user",
        "desc": "Save and organize reusable code snippets. Each one renders as a ray.so-style card — Mac-style traffic-light window chrome, real syntax highlighting for 20+ languages, and a one-click copy button.",
        "python": "routers/dev_tools.py — plain CRUD against col_snippets(), with an isPublic boolean flag and indexes on (userId, createdAt) and isPublic for efficient personal-list and public-browse queries respectively. The syntax-highlighted card rendering is pure frontend (react-syntax-highlighter/Prism) — no backend involvement.",
    },
    "/resume-analyzer": {
        "label": "Resume & ATS Analyzer", "audience": "user",
        "desc": "AI reviews a resume for ATS-friendliness and gives a score.",
        "python": "routers/resume.py — extracts text server-side with pdfplumber (PDF) or python-docx (Word docs), then sends the extracted text to Groq with a scoring prompt, expecting a structured JSON response back that's validated before returning to the client.",
    },
    "/background-remover": {
        "label": "Background Remover", "audience": "all",
        "desc": "Removes image backgrounds entirely client-side (ONNX runtime in the browser) — images are never uploaded to a server.",
        "python": "Zero backend involvement — the @imgly/background-removal JS library runs a segmentation ML model entirely in-browser via ONNX Runtime Web (WebAssembly/WebGPU). No Python code touches this feature at all.",
    },
    "/notes": {
        "label": "Notes", "audience": "user",
        "desc": "Zero-knowledge encrypted personal notes. Notes are encrypted/decrypted only in your browser with a passphrase only you know — even an admin with full database access cannot read them. Supports a per-tab 'remember this session' option (with a confirmation warning) and a blur mode for over-the-shoulder privacy.",
        "python": "routers/notes.py stores only opaque ciphertext + IV strings (base64) and a random salt (os.urandom) — it never receives or derives the encryption key, all AES-GCM/PBKDF2 work happens in the browser's Web Crypto API. Optionally lives on a completely separate MongoDB connection (db_mongo.py's notes_db(), driven by a NOTES_MONGO_URL env var) so it doesn't share storage quota with the main database — falls back to the main database automatically if that variable isn't set.",
    },
    "/challenge": {
        "label": "JS Challenge", "audience": "user",
        "desc": "30-day progressive DSA challenge, one problem unlocked per day.",
        "python": "routers/challenge.py — the 'day number' is computed server-side from the user's first-ever access date stored in col_dsa_challenge(), preventing a client from just changing a local variable to unlock future days early.",
    },
    "/progress": {
        "label": "My Progress", "audience": "user",
        "desc": "Personal stats: streaks, accuracy, activity over time.",
        "python": "routers/stats.py — aggregation queries (MongoDB's aggregate() pipeline, the Mongo equivalent of SQL GROUP BY) computing streaks and counts from raw activity documents rather than maintaining separately-updated counters.",
    },
    "/quiz": {
        "label": "Quiz Mode", "audience": "user",
        "desc": "Timed multiple-choice quiz mode.",
        "python": "routers/questions.py — quiz questions are sampled from the existing questions collection; scoring/timing logic runs client-side, with only the final result posted back to the backend for stats.",
    },
    "/study": {
        "label": "Study Hub", "audience": "all",
        "desc": "Structured learning guide across many topics, with per-topic AI explanations and progress tracking.",
        "python": "The topic CONTENT itself (hundreds of entries) is static data bundled into the frontend (client/src/data/studyTopics/*.js) — no backend call to load a topic. The backend (routers/study.py, routers/advanced_study.py) is only involved for: per-user 'reviewed' checkbox state (col_study_reviewed) and the AI Explainer/Q&A panel, which calls Groq the same way Ask AI does.",
    },
    "/mock-interview": {
        "label": "Mock Interview", "audience": "user",
        "desc": "AI-simulated interview with follow-up questions, voice or written answers, and AI scoring. One-tap role presets — 🎨 Frontend, ⚙️ Backend, 🚀 Full Stack — pre-select a curated mix of topics instead of multi-selecting individual tech categories by hand.",
        "python": "routers/advanced_study.py — each turn sends the conversation-so-far as context to Groq, asking it to both respond in-character as an interviewer and decide the next follow-up question, rather than a fixed decision tree. The role presets are a purely client-side mapping (MockInterview.jsx) from a role name to a curated list of existing category ids — no separate backend endpoint, they just pre-fill the same category filter the manual chips use.",
    },
    "/typing-race": {
        "label": "Typing Race", "audience": "user",
        "desc": "Daily typing challenge — 3 code snippets, the SAME 3 for every user each day, one shot each (no skipping, no reroll). Submit only unlocks once your typed text exactly matches the snippet — no partial credit, and no way to submit something wrong at all (client-side the button just stays disabled; server-side a mismatched attempt is rejected outright and doesn't consume the shot). Type snippet 1, get it exactly right, submit, see your time, click Next, repeat for snippets 2 and 3; once all 3 are done you're ranked by total time on 'Today's Team' against everyone else who's finished (others show '2/3 done' if mid-way, or 'Not played today' — deactivated/pending/blocked users and anyone under an active lockout never appear here or get nagged by the reminder). Anyone who hasn't started gets an automatic reminder at an admin-configurable time (default 11:00 AM IST). Each snippet is drawn on a canvas rather than plain DOM text, and the answer box blocks pasting, dragging text in, Ctrl/Cmd+V, and its own right-click menu — so there's nothing to drag-select, Inspect-Element, or paste your way past (including text copied via something like Google Lens reading it off a screenshot) — the daily set is also fixed and can't be rerolled for an easier one. Every correct snippet earns points toward your profile level (+15 each), completing all 3 in one day earns the 'Speed Typist' badge, and playing on consecutive days builds a streak shown as '🔥 N-day streak' in the header.",
        "python": "routers/game.py. GET /game/typing-race/board returns one combined payload — today's 3 snippets (derived deterministically via random.Random(date_string).sample(...), so every user and every server restart computes the identical set with zero stored state), the current user's own progress, and the full team roster — replacing what would otherwise be 3 separate round trips, same pattern as WorkBoard's own GET /board. POST /game/typing-race/submit takes a snippetIndex (0-2), rejects it if that index was already submitted today (one shot each), re-derives the expected snippet server-side (never trusts the client's copy of it), and rejects with a 400 if body.typed isn't an exact match rather than storing a loss — every doc that does get stored in col_game_scores() is therefore a verified correct attempt by construction, so the roster logic needs no separate 'wrong'/'disqualified' branch: completing all 3 always means ranked, sorted by summed timeMs. On a successful submit it also calls gamification.award_points() (+15/snippet), _update_daily_streak(userId, 'typingRace', today) to bump the streak, and awards the 'speed_typist' badge once done_count hits 3 for the day — response includes pointsEarned/totalPoints/newBadge/streak so the frontend can toast them. Both the roster query and the reminder job (scheduler_tasks.py: fire_typing_race_reminder) filter out pending/blocked/rejected/disabled or currently-locked-out users via a shared _is_active_user() check using the same status vocabulary deps.py's current_user() enforces at login.",
    },
    "/mini-sudoku": {
        "label": "Mini Sudoku", "audience": "user",
        "desc": "A second, lighter game — unlimited plays, no daily cap. Pick a size (6x6, 7x7, or 8x8) each time, solve it, submit; Submit only unlocks once the grid is fully filled and passes a live row/column/box validity check (conflicting cells highlight red as you type), and the server independently re-checks the exact solution before it counts. Ranked daily by cumulative marks across every puzzle you've solved that day — not by a single time, since play count and size are entirely up to you. Anyone who hasn't solved one yet today gets an automatic reminder at an admin-configurable time (default 11:00 AM IST). Every solve earns +15 points toward your profile level, your first-ever solve earns the 'Sudoku Solver' badge, and solving on consecutive days builds a streak shown as '🔥 N-day streak' in the header.",
        "python": "routers/game.py. Unlike Typing Race's shared daily-seed snippets, each Sudoku attempt is a genuinely fresh random puzzle (no 'same puzzle for everyone' requirement here): POST /game/sudoku/start generates a puzzle+solution via backtracking (_generate_sudoku_solution — a standard constraint-satisfaction algorithm, no AI/LLM involved, sub-millisecond even at 8x8) and stores the solution server-side against a short-lived session doc in col_sudoku_sessions, returning only the puzzle (with a sessionId) to the client. POST /game/sudoku/submit validates the sessionId belongs to the requesting user, rejects a non-matching grid without deleting the session (so a genuine mistake can be retried against the same puzzle rather than losing it), and on a correct submit computes marks via _sudoku_score() — a base-points-per-size value scaled by how the solve time compares to a 'par' time for that size (capped at 1.5x for a fast solve, floored at 0.4x for a slow one) — then deletes the session so it can't be resubmitted for extra marks. It also calls gamification.award_points() (+15), _update_daily_streak(userId, 'sudoku', today), and awards the 'sudoku_solver' badge on the user's first-ever solve (counted via col_sudoku_scores count right after insert) — response includes pointsEarned/totalPoints/newBadge/streak. GET /game/sudoku/board aggregates col_sudoku_scores per user for today (MongoDB $group: sum of score, count of puzzles, min time) to build the ranked roster. 7x7 has no box constraint at all (7 is prime, so there's no clean rectangular box subdivision — it's played as a pure Latin square) while 6x6 uses 2x3 boxes and 8x8 uses 2x4.",
    },
    "/flashcards": {
        "label": "Flashcards", "audience": "user",
        "desc": "Spaced-repetition style flashcards generated from questions.",
        "python": "routers/advanced_study.py — implements a simplified spaced-repetition scheduling algorithm: each card stores a nextReview timestamp that gets pushed further out each time you mark it 'known', and reset if marked 'forgotten', queried via col_flashcards() indexed on (userId, nextReview).",
    },
    "/my-questions": {
        "label": "My Questions", "audience": "user",
        "desc": "Questions you've personally submitted.",
        "python": "routers/questions.py — a filtered GET (WHERE userId = current user) against the same questions collection and endpoints the public question feed uses.",
    },
    "/my-answers": {
        "label": "My Answers", "audience": "user",
        "desc": "Your saved answers to questions, AI-graded.",
        "python": "routers/questions.py's check_answer() flow calls Groq with the question, the ideal answer, and the user's answer, asking for a strict JSON verdict (score, grade, feedback) — this is the same AI-comparison pattern used for coding question 'explain' features, just without the sandboxed execution since these are prose/conceptual answers.",
    },
    "/bookmarks": {
        "label": "Bookmarks", "audience": "user",
        "desc": "Saved questions for later review.",
        "python": "routers/questions.py — a bookmark is just the current user's ID appended to a `bookmarks` array field on the question document ($addToSet / $pull in MongoDB update operators, which handle add/remove without needing to fetch-then-check-then-write).",
    },
    "/leaderboard": {
        "label": "Leaderboard", "audience": "all",
        "desc": "Ranks users by activity/contribution, with each entry's Cloudinary profile photo (or initials if none set).",
        "python": "routers/stats.py's GET /leaderboard aggregates questionsPosted/upvotesReceived per user, then does one batched $in query against col_user_profiles() for all ranked users' avatar_url — never one profile lookup per row.",
    },
    "/search": {
        "label": "Advanced Search", "audience": "user",
        "desc": "Full-text search across all questions with filters.",
        "python": "routers/questions.py using MongoDB's text index ($text search) on the question/answer fields, combined with additional exact-match filters (category, level, type) in the same query.",
    },
    "/recommendations": {
        "label": "Recommended", "audience": "user",
        "desc": "Personalized question recommendations.",
        "python": "routers/gamification.py or advanced_study.py — recommendations are computed heuristically (weighted by category gaps in your answered-question history), not via a machine learning recommender model.",
    },
    "/roadmap": {
        "label": "Learning Path", "audience": "user",
        "desc": "Suggested topic order for structured learning.",
        "python": "Mostly static ordering data (which topic should come before which) rather than a dynamically-computed backend recommendation.",
    },
    "/timed-challenge": {
        "label": "Timed Challenge", "audience": "user",
        "desc": "Solve as many questions as possible against the clock.",
        "python": "routers/timed_challenge.py — the timer is authoritative client-side for UX, but the server independently validates elapsed time using the session's stored startedAt timestamp before accepting a final score, so a client can't just report an inflated score.",
    },
    "/notifications": {
        "label": "Notifications", "audience": "user",
        "desc": "In-app notification inbox.",
        "python": "routers/admin.py hosts both the REST endpoints (list/mark-read) and the WebSocket endpoint (/admin/notifications/ws) that pushes live unread-count updates — FastAPI supports both patterns in the same router file.",
    },
    "/my-feedback": {
        "label": "My Feedback", "audience": "user",
        "desc": "Feedback you've submitted to the admins.",
        "python": "routers/feedback.py — plain CRUD, gated so guests can only see/submit if the admin has explicitly enabled guest_feedback_enabled in the app config.",
    },
    "/guide": {
        "label": "Project Guide", "audience": "all",
        "desc": "A human-readable walkthrough of how the whole app works.",
        "python": "Static content page — no dedicated backend endpoint.",
    },
    # "/jobs" disabled for now — kept for when it's re-enabled.
    # "/jobs": {
    #     "label": "Recent Jobs", "audience": "user",
    #     "desc": "Real, live tech job listings from the last 7 days, sourced from a free public job board API (no Google Jobs feed exists for free, so this is the closest equivalent). Currently Germany/Europe-focused with no India coverage — a proper India feed would need a different provider (e.g. Adzuna) with its own free API key; noted as a known gap for now.",
    #     "python": "routers/jobs.py fetches from Arbeitnow's public API via httpx, filters to the last 7 days and tech-relevant tags, and caches the result in a plain in-memory Python dict for 20 minutes (no Redis needed at this scale) so repeated page views don't hammer the upstream API on every request.",
    # },
    "/messages": {
        "label": "Messages", "audience": "user",
        "desc": "Private 1-to-1 chat between an admin and a user. Only an admin can start a new conversation — there is no user-to-user chat — but once a conversation exists, the user can reply freely with rich text, a code block, or an image. Each message has a hover toolbar to copy its text, react with an emoji, pin it, or (for longer messages) get an AI summary. Reactions use the same fixed 6-emoji set as Community (👍 ❤️ 😂 🎉 😮 👀) and update live over the WebSocket for the other participant(s). A per-conversation blur toggle hides message content on screen until hovered, for privacy in shared spaces (same idea as Notes). Every message triggers both a push and in-app notification.",
        "python": "routers/admin_chat.py stores conversations and messages in MongoDB and delivers new messages in real time over a per-user WebSocket (/api/admin-chat/ws), authenticated via a JWT passed as a ?token= query param rather than trusting a raw user id — the same pattern used by the WorkBoard and admin notification sockets. REST endpoints handle starting a chat, listing conversations with unread counts, fetching/marking messages read, and sending a message (which also fires the WebSocket push plus a notification). The conversation-list/draft preview text special-cases a Quill code-block message (detected by a `<pre` tag in the stored HTML) to show '💻 Code snippet' instead of dumping the raw code, the same way an image-only message shows '📷 Image'. The rich-text composer's Enter-to-send keyboard binding checks whether the cursor is inside a code block first and, if so, lets Quill insert a normal newline instead of submitting — otherwise every Enter press while writing multi-line code would send the message mid-block. POST /{chatId}/messages/{messageId}/react toggles reactions.{emoji} on the message doc via $addToSet/$pull (mirroring Community's question reactions), then broadcasts a react_message WS event to the other participant(s) with the updated {emoji: count} map so it updates live without a refetch.",
    },
    "/meetings": {
        "label": "Meetings", "audience": "all",
        "desc": "Free video calls via an embedded Jitsi Meet room on Jitsi's public server (no paid SDK). Only admins can start or schedule a meeting and choose who's invited; invited users get a notification with a join link. A 6-character join code also lets anyone — including guests with no account — join a specific meeting without being on the invite list, if the admin shares it with them. Admins can end the meeting for everyone from inside the call, and can minimize the call to a small floating window to keep using the rest of the site. Note: whoever joins first must sign in once via Google/GitHub through Jitsi's own screen to become moderator (Jitsi's anti-spam policy, not ours) — everyone joining after that needs no login at all.",
        "python": "routers/meetings.py generates a random room name (secrets.token_hex) plus a separate short join code (6 random characters from a set excluding ambiguous ones like 0/O/1/I) and stores the meeting doc + invite list in MongoDB. GET /meetings/join/{code} uses optional_user (not current_user) specifically so guests with no token at all can still look up and join a meeting by code. The actual video call itself involves zero backend Python code — the frontend just embeds an <iframe> pointed at meet.jit.si with that room name, and Jitsi's own infrastructure (not ours) handles all the real-time video/audio.",
    },
    "/profile": {
        "label": "My Profile", "audience": "user",
        "desc": "Account details and preferences, plus a Settings panel: account info (email, member-since date), appearance (dark/light theme, snow effect), a change-password form, a Notifications section to snooze all push + in-app notifications for 1 day/2 days/1 week/permanently, and a Leave/Holiday section — mark yourself out for a single day or a date range, and Work Board reminders + the Community posting rotation both respect it automatically.",
        "python": "routers/profile.py for profile fields (bio, links, change-password) and the notification mute (PATCH /profile/my/notifications-mute stores a notifyMutedUntil timestamp on the user's profile doc; a shared db_mongo.user_notifications_muted() helper checks it, called from every recurring reminder in scheduler_tasks.py alongside the existing admin-wide notifications_enabled() kill switch), routers/uploads.py for the picture (streamed to Cloudinary, only the HTTPS URL is ever saved to MongoDB, never the image bytes), and routers/leaves.py for leave requests (col_user_leaves, a simple startDate/endDate string range — string comparison works fine since YYYY-MM-DD sorts lexicographically same as chronologically). Submitting a leave notifies all admins immediately. Theme/snow preferences are pure client-side localStorage state, no backend involved.",
    },
    "/devtools?tool=mock-api": {
        "label": "Mock API Generator", "audience": "user",
        "desc": "Get a real, live URL that returns dummy JSON data — users, posts, products, todos, comments, or images with captions (via picsum.photos). No login, no AI involved. The URL automatically points at the right server whether you're in dev or production.",
        "python": "routers/dev_tools.py's GET /mock/{resource} has no auth dependency at all (fully public). Data is generated deterministically using Python's random.Random(seed) — the same resource+count+index always produces the same fake record, without storing anything in a database.",
    },
    "/devtools?tool=ts": {
        "label": "TS Adder", "audience": "user",
        "desc": "Converts JavaScript to TypeScript with inferred types.",
        "python": "routers/dev_tools.py — a single-shot Groq prompt asking for the TypeScript-annotated version of pasted code, returned as plain text.",
    },
    "/devtools?tool=errors": {
        "label": "Error Finder", "audience": "user",
        "desc": "AI scans pasted code for bugs.",
        "python": "routers/dev_tools.py — same single-shot Groq-prompt pattern as TS Adder, different system prompt asking for bug analysis instead of type conversion.",
    },
    "/devtools?tool=js": {
        "label": "JS Compiler (Dev Tools)", "audience": "user",
        "desc": "Same sandboxed JS runner, embedded in Dev Tools.",
        "python": "No backend execution — identical client-side new Function(code) sandbox as the standalone /js-compiler page.",
    },
    "/devtools?tool=sql-query": {
        "label": "AI Dev Assistant · SQL", "audience": "user",
        "desc": "Describe what you want in plain English (e.g. 'get user id where email is x') and get back a real SQL query plus a short explanation.",
        "python": "routers/study.py's POST /study/sql-query — same single-shot Groq-prompt pattern as the other AI Dev Assistant tools (git/tests/concept), gated by require_ai_enabled so guests are bounced (no real JWT) rather than shown fake results.",
    },
    "/admin": {
        "label": "Admin Panel", "audience": "admin",
        "desc": "User management, app-wide config (maintenance mode, guest mode, force update, WorkBoard reminder times, task due-date reminder time, Typing Race and Mini Sudoku daily play reminder times, the weekly digest time, AI daily limits), a 'Who's updated?' list showing each user's last-reported app build version after a Force Update push, a Community panel showing today's unanswered-question count plus the posting roster, notifications, feature docs, and the full backend API reference (/api-docs) — all admin-only, enforced both by hidden nav and by a route-level guard so they can't be reached by a direct URL either.",
        "python": "routers/admin.py — the single largest router in the codebase. App-wide settings live in one MongoDB document ({_id: 'config'} in col_app_config()), read via a public GET (no secrets in it) and an admin-only GET (same doc, defaults filled in with setdefault()), written via a single PUT with a Pydantic model where every field is Optional so partial updates only touch what was actually sent. GET /admin/app-versions cross-references every user against their last col_user_profiles.appVersion (reported once per session by the frontend via POST /profile/my/app-version, stamped at build time via Vite's __APP_VERSION__ define) to flag who's still on an older build. GET /admin/community/unanswered counts today's Community questions with commentCount 0 and returns the Mon-Fri posting-rotation roster from col_community_schedule.",
    },
}

# Deeper "how it actually works" notes for flagship features — used when a
# user asks "how does X work" rather than just "where is X".
BEHIND_THE_SCENES = {
    "notes_encryption": (
        "Notes use zero-knowledge, client-side AES-GCM encryption with a key derived from your passphrase "
        "via PBKDF2 (150,000 iterations). The server only ever stores ciphertext and a random salt — it "
        "never sees your passphrase or the decrypted text. There is deliberately no admin override or "
        "master key: not even an admin can decrypt another user's notes."
    ),
    "js_coding_grading": (
        "JS Coding Questions are graded by actually executing your code in an isolated V8 sandbox "
        "(mini-racer) against real test cases and comparing the output — not by an AI guessing whether "
        "your answer 'looks right'. Every AI-generated question is self-tested against its own model "
        "answer before being shown to you, so a broken reference solution never ships."
    ),
    "guest_mode": (
        "Guest mode is a purely client-side, no-account preview — no real backend session exists for "
        "guests. Admins can disable guest mode entirely from the Admin Panel; when off, anyone currently "
        "browsing as a guest is signed out and shown a message instead of the app. Guests now see every "
        "sidebar item (not a filtered subset) — the ones they can't actually open render blurred with a "
        "lock icon, and clicking one opens a prompt to log in, sign up, or reach out to admin via the "
        "Feedback modal for access, instead of just silently not appearing."
    ),
    "notification_muting": (
        "A user can snooze all notifications (both push and in-app) for 1 day, 2 days, a week, or "
        "permanently from Profile → Settings — stored as a notifyMutedUntil timestamp on their profile "
        "doc. Every recurring reminder (WorkBoard, Community, task due-dates, Typing Race, Mini Sudoku, "
        "the weekly digest) checks this alongside the separate admin-wide notifications_enabled kill switch "
        "before sending, through one shared _should_notify() gate in scheduler_tasks.py, so muting is "
        "enforced consistently everywhere rather than needing to be re-checked ad hoc in each reminder."
    ),
    "game_points_badges_streaks": (
        "Typing Race and Mini Sudoku both feed the same points/level/badges system that questions/answers "
        "already use (routers/gamification.py): a correct Typing Race snippet or Sudoku solve calls the "
        "shared award_points()/award_badge() helpers directly (no HTTP round-trip between routers) rather "
        "than duplicating the points math. Two game-specific badges: 'Speed Typist' (all 3 Typing Race "
        "snippets done in one day) and 'Sudoku Solver' (first-ever solve). Daily streaks are tracked "
        "per-game via a generic _update_daily_streak(userId, field_prefix, today) helper in routers/game.py "
        "— stores {prefix}LastDate/{prefix}Streak on the user profile, increments on a consecutive day, "
        "resets to 1 on a gap, and is a safe no-op if called again the same day (so it can run on every "
        "submit without special-casing 'already played today')."
    ),
    "emoji_reactions": (
        "Both Community questions and Messages support a fixed set of 6 emoji reactions (👍 ❤️ 😂 🎉 😮 👀 "
        "— not a freeform picker, deliberately kept small). Storage shape is identical on both surfaces: "
        "a `reactions: {emoji: [userIds]}` dict on the parent doc (question or chat message), toggled via "
        "MongoDB $addToSet/$pull on reactions.{emoji} — the same toggle pattern the existing upvote field "
        "already used. Serialization strips it down to {emoji: count} plus the caller's own myReactions "
        "list so the frontend never has to know who else reacted. On Messages the toggle also broadcasts "
        "a react_message WebSocket event to the other chat participant(s) so their view updates live."
    ),
    "weekly_digest": (
        "A Monday-morning notification (admin-configurable time via App Config → Weekly Digest Settings, "
        "default 09:00 IST) summarizing each user's Typing Race + Mini Sudoku activity from the past 7 "
        "days — snippets typed, sudokus solved, current streaks — sent as both a push and in-app "
        "notification. Unlike the daily game reminders, it's deliberately opt-out by construction rather "
        "than nag-everyone: a user with zero activity in the window gets nothing at all, so someone who's "
        "never touched these games is never pestered with an empty summary."
    ),
    "diagram_generation": (
        "Ask AI's Diagram mode asks Groq for a Mermaid.js flowchart definition describing whatever project/"
        "system structure you typed, then renders that definition into an actual SVG diagram entirely in "
        "the browser via the mermaid npm package — the backend never generates an image, only the text "
        "description of one. Nothing is persisted; regenerating with the same prompt can produce a "
        "differently-worded (though similarly-shaped) diagram since it's a fresh AI call each time."
    ),
    "typing_race_daily_challenge": (
        "Typing Race's daily 3 snippets are derived with Python's random.Random(date_string).sample(...) — "
        "seeded purely by today's date, so every user (and the server itself, even across a restart) "
        "independently computes the identical 3 snippets with nothing stored in the database for it. This "
        "is also what makes it fair: a client can't request a different, easier set, and the server "
        "re-derives the expected snippet for a given index at submit time rather than trusting whatever "
        "text the client claims it was typing against."
    ),
    "sudoku_session_design": (
        "Mini Sudoku deliberately does NOT reuse Typing Race's date-seeded approach (regenerate "
        "the day's puzzle from today's date string on every request) — an early version did, and it had a "
        "real bug: a submission that happened to straddle midnight IST got validated against a different "
        "day's puzzle than the one actually solved, rejecting a perfectly correct answer. Since Sudoku also "
        "has no 'same puzzle for everyone' requirement (unlimited plays, any size, any time), each attempt "
        "instead gets a one-time session: the puzzle+solution are generated once when you hit Start and the "
        "solution is stored server-side against a session id, so validating a submission never depends on "
        "recomputing anything from 'today's date' again later — the exact class of bug that hit Typing Race "
        "structurally can't happen here."
    ),
    "scheduled_disable": (
        "Admins can disable a user permanently or schedule a temporary lockout (hours/days/custom time). "
        "A locked-out user cannot log in, call any API, or use AI features at all while the lockout is "
        "active — access is restored automatically the moment the scheduled time passes, no admin action "
        "needed."
    ),
    "lazy_loading": (
        "Every page in the web app is code-split with React.lazy() — pages are fetched only when you "
        "actually navigate to them instead of all being bundled into one huge file loaded up front. This "
        "is what keeps navigation fast even as the app has grown to dozens of pages."
    ),
    "mock_api": (
        "The Mock API Generator's URL is built from an environment variable baked in at build time, so it "
        "automatically points at the right server — localhost in development, the real production domain "
        "once deployed — with no code change needed."
    ),
    "image_uploads": (
        "Profile pictures and (soon) Notes image embeds are uploaded to Cloudinary via the backend's "
        "Python SDK — the browser sends the file to our server, our server forwards it to Cloudinary, and "
        "only the returned HTTPS URL is stored in MongoDB. This keeps documents small regardless of image "
        "size and means images are served from Cloudinary's CDN, not our own server."
    ),
}


def find_route_by_query(query: str):
    """Very loose keyword match over route labels/descriptions — used to give
    the chatbot a hint about which page the user might be asking about."""
    q = query.lower()
    matches = []
    for path, r in ROUTES.items():
        label = r["label"]
        if any(word in q for word in label.lower().split()) or any(word in label.lower() for word in q.split()):
            matches.append((path, label, r["desc"], r["audience"]))
    return matches[:5]


def build_system_prompt() -> str:
    route_lines = "\n".join(
        f"- {path} — {r['label']}: {r['desc']} (available to: {r['audience']}) [Python/backend: {r['python']}]"
        for path, r in ROUTES.items()
    )
    behind_lines = "\n".join(f"- {k}: {v}" for k, v in BEHIND_THE_SCENES.items())
    python_lines = "\n".join(f"- {k}: {v}" for k, v in PYTHON_ARCHITECTURE.items())
    return f"""You are the Dev Life Project Assistant, embedded inside the Dev Life app.

ABOUT THE PROJECT:
{PROJECT_SUMMARY}

SCOPE — you may ONLY discuss:
1. What Dev Life is, its features, and how specific features work "behind the scenes" (including backend/Python implementation details).
2. Helping the user find or navigate to a page/feature within Dev Life.
You must REFUSE (briefly, politely) anything outside this scope: general knowledge questions,
coding help unrelated to this project, opinions, or any topic that isn't about Dev Life itself.
For general coding/interview questions, tell the user to use the "Ask AI" page instead (/ask) — that's
the general-purpose assistant; you are project-scoped only.

NEVER reveal: environment variables, API keys, database connection strings, other users' data, admin
credentials, internal secrets, or implementation details that would help someone bypass security
(e.g. exact encryption key derivation parameters beyond what's already public knowledge below).

PAGES AND ROUTES (path — label: description (audience) [Python/backend notes]):
{route_lines}

BEHIND-THE-SCENES EXPLANATIONS (use these when asked "how does X work"):
{behind_lines}

PYTHON BACKEND ARCHITECTURE (use these when asked how the backend/Python side works in general):
{python_lines}

RESPONSE FORMAT — respond with ONLY a JSON object, no markdown fences, no extra text:
{{"reply": "<your answer, plain text, concise>", "navigateTo": "<a path from the list above if the user asked how to get somewhere or asked about a specific page, else null>"}}
"""
