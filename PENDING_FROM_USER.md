# Pending / Blocked — Needs Your Input

Things that can't move forward right now because they need a decision, credentials, or
sign-up from you. Nothing here is forgotten — just parked until you provide what's needed.

## Resolved

- ~~Notes: separate MongoDB~~ — done. `NOTES_MONGO_URL` set to the new cluster
  (`cluster0.fnxvivs.mongodb.net/devquiz_notes`), verified working with a real
  write+read test, old test data cleaned up.
- ~~Cloudinary credentials~~ — done. Verified with a real ping + upload + delete test,
  all successful. Wired into the backend for Profile picture upload and Notes image
  embedding (see Features Doc for details).
- ~~Chatbot voice commands~~ — done. Opt-in "Hey DevQuiz" wake word (Web Speech API),
  auto-navigates on voice commands without needing a manual "Go there" tap. Hides itself
  on browsers without Speech Recognition support (mainly Safari).

## Needs a decision from you

- **Email notifications** (2026-07-11) — you asked to add email as a third
  notification channel alongside push + in-app. This needs a real
  email-sending provider (a free tier still requires signing up + an API
  key — options I raised: Resend, Brevo, or Gmail SMTP). You said "remind
  me about this later" — flagging here so it doesn't get lost; bring it
  back up whenever you're ready to pick one.
- **Jobs page — India coverage.** Arbeitnow (the current free, no-key source) is
  Germany/Europe-only — its `location` filter doesn't actually work, confirmed by testing.
  There's no free, keyless job API with real India coverage. Adzuna has a free tier with
  real India data but requires a free API key (2-minute signup at
  developer.adzuna.com, no cost). Left as Arbeitnow for now — tell me if/when you want to
  switch, and give me the Adzuna `app_id` + `app_key`.

## Bigger asks, not started yet

- ~~WhatsApp privacy extension~~ — moved out to its own separate folder outside this
  repo; no longer tracked here. (Original `PLAN.md` left behind in
  `whatsapp-privacy-extension/` for reference only.)
- **Chrome extension publishing to the Chrome Web Store** — needs a one-time $5 Google
  developer registration fee (the only real cost anywhere in this whole project) plus your
  Google account to actually submit it; I can prep everything else (icons, store listing
  copy, zip package) but the submission itself needs your account.

## Removed on request

- **🔔 Notification Logs section in Admin panel** — removed 2026-07 ("we don't need
  this as of now"). Was a collapsible list of past manually-sent notifications on the
  admin page. The backend endpoint it read from (`GET /admin/notify/history`) and the
  logging it reads (`push_notifications` collection, still written on every send) were
  left untouched — only the admin UI section and its lazy-load state were deleted from
  `Admin.jsx`. Easy to bring back later since nothing backend-side changed.

---
*Update this file as items get resolved — remove a line once you've provided what it needs.*
