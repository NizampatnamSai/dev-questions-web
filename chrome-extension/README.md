# DevQuiz — Save to Notes (Chrome Extension)

Select text on any website, right-click, and save it straight into your
end-to-end encrypted DevQuiz Notes — with the source URL, a timestamp, and an
importance tag (low/medium/high) attached automatically.

This is a standalone folder on purpose — it does not import from or share
build tooling with `client/` (web) or the mobile app, so nothing here can
break either of those.

## How it works

- **Capture**: select text → right-click → "Save selection to DevQuiz Notes".
  This stores the selection + page URL + timestamp locally in the extension
  (not on the page, not on any server yet).
- **Save**: click the extension icon. Log in with your DevQuiz account (once —
  the token is kept in the extension's own storage, isolated from any
  website). Pick an importance level, enter your **Notes passphrase**, and
  save. Everything is encrypted with the exact same AES-GCM + PBKDF2 scheme
  the web app uses (`crypto.js` mirrors `client/src/utils/noteCrypto.js`
  exactly) — the passphrase and plaintext never leave your browser. The note
  shows up in the DevQuiz web app's Notes page immediately, fully decryptable
  there since it's the same encryption scheme and the same account's salt.

## Loading it locally (unpacked)

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this `chrome-extension/` folder.
4. Pin the extension from the puzzle-piece menu for easy access.

The extension auto-detects whether your local dev backend (`localhost:8000`)
is running and uses it; otherwise it falls back to the production API.

## Notes

- Requires that you've already set up a Notes passphrase once in the web app
  (`/notes`) — the extension doesn't re-implement first-time setup, only
  unlock + save.
- Nothing here touches `client/` or `server/` except calling the same public
  REST API (`/api/auth/login`, `/api/notes/salt`, `/api/notes`) the web app
  already uses.
