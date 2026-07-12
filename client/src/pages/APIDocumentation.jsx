import { motion } from "framer-motion";

export default function APIDocumentation() {
  const endpoints = [
    { method: "POST", path: "/api/auth/register", desc: "Register new user" },
    { method: "POST", path: "/api/auth/login", desc: "Login user" },
    { method: "GET", path: "/api/questions/community", desc: "Get community questions" },
    { method: "POST", path: "/api/questions/create", desc: "Create new question" },
    { method: "GET", path: "/api/questions/search/advanced", desc: "Advanced search with filters" },
    { method: "POST", path: "/api/questions/{id}/react", desc: "Toggle an emoji reaction (👍 ❤️ 😂 🎉 😮 👀) on a question — same emoji toggles it off" },
    { method: "GET", path: "/api/profile/my/profile", desc: "Get current user profile" },
    { method: "PATCH", path: "/api/profile/my/profile", desc: "Update user profile" },
    { method: "PATCH", path: "/api/profile/my/notifications-mute", desc: "Snooze all push + in-app notifications for 1d/2d/1w/permanent, or unmute with 'none'" },
    { method: "POST", path: "/api/profile/my/app-version", desc: "Report the frontend's build version once per session, for Admin's Force Update panel" },
    { method: "POST", path: "/api/discussion/questions/{id}/comments", desc: "Create comment" },
    { method: "GET", path: "/api/discussion/questions/{id}/comments", desc: "Get comments" },
    { method: "POST", path: "/api/difficulty/questions/{id}/difficulty", desc: "Rate question difficulty" },
    { method: "GET", path: "/api/difficulty/questions/difficulty/stats/{id}", desc: "Get difficulty stats" },
    { method: "POST", path: "/api/gamification/profile/add-points/{action}", desc: "Add points for actions" },
    { method: "GET", path: "/api/gamification/profile/badges", desc: "Get user badges" },
    { method: "POST", path: "/api/challenge/challenges/start", desc: "Start timed challenge" },
    { method: "POST", path: "/api/challenge/challenges/{id}/finish", desc: "Finish timed challenge" },
    { method: "GET", path: "/api/feedback", desc: "Submit feedback" },
    { method: "GET", path: "/api/feedback/admin/all", desc: "Get all feedback (admin)" },

    // Tasks (Jira-style workflow: todo → started → testing → completed)
    { method: "GET", path: "/api/tasks", desc: "List tasks — all tasks for admins, assigned-to-you for regular users" },
    { method: "POST", path: "/api/tasks", desc: "Create a task (admin only)" },
    { method: "PATCH", path: "/api/tasks/{id}", desc: "Edit a task (admin only)" },
    { method: "DELETE", path: "/api/tasks/{id}", desc: "Delete a task (admin only)" },
    { method: "PATCH", path: "/api/tasks/{id}/status", desc: "Move a task's status — regular users move one stage at a time and can't set 'completed'; admins can set any status" },
    { method: "GET", path: "/api/tasks/{id}/comments", desc: "Get a task's comment thread" },
    { method: "POST", path: "/api/tasks/{id}/comments", desc: "Post a comment on a task" },
    { method: "DELETE", path: "/api/tasks/{id}/comments/{commentId}", desc: "Delete your own comment (or any, if admin)" },

    // Work Board
    { method: "GET", path: "/api/workboard/posts", desc: "Get today's (or a given date's) work board posts" },
    { method: "POST", path: "/api/workboard/posts", desc: "Post today's update (one per day)" },
    { method: "PUT", path: "/api/workboard/posts/{id}", desc: "Edit your post — only within the configured edit window" },
    { method: "POST", path: "/api/workboard/posts/{id}/reply", desc: "Add a follow-up reply to your own post once the edit window has closed" },
    { method: "GET", path: "/api/workboard/export", desc: "Export a day's (or all) posts as CSV (admin only)" },
    { method: "PATCH", path: "/api/workboard/config", desc: "Update the reminder time and edit window (admin only)" },

    // Typing Race — daily 3-snippet challenge, same set for everyone, ranked by total time
    { method: "GET", path: "/api/game/typing-race/board", desc: "Single combined payload: today's 3 snippets, your own progress, and the full team roster" },
    { method: "POST", path: "/api/game/typing-race/submit", desc: "Submit a completed snippet (one shot per snippet per day, exact match required) — returns WPM, points earned, any new badge, and your current daily streak" },

    // Mini Sudoku — unlimited plays, pick a size, ranked daily by cumulative marks
    { method: "POST", path: "/api/game/sudoku/start", desc: "Start a new puzzle (size 6, 7, or 8) — returns a sessionId + the puzzle (never the solution)" },
    { method: "POST", path: "/api/game/sudoku/submit", desc: "Submit a solved grid for a session (exact match required) — returns marks earned, points earned, any new badge, and your current daily streak" },
    { method: "GET", path: "/api/game/sudoku/board", desc: "Today's cumulative-marks roster, plus your own today's total score, puzzle count, and current streak" },

    // Admin Panel — app-wide config, force-update version tracking, community oversight
    { method: "GET", path: "/api/admin/app-config", desc: "Get all app-wide settings, incl. reminder times (WorkBoard, task due-date, Typing Race, Mini Sudoku, weekly digest, Community) — admin only" },
    { method: "PUT", path: "/api/admin/app-config", desc: "Update app-wide settings; changing a reminder time live-reschedules that cron job — admin only" },
    { method: "GET", path: "/api/admin/app-versions", desc: "Who's on the latest deployed build vs. an older one, from each user's last-reported app version — admin only" },
    { method: "GET", path: "/api/admin/community/unanswered", desc: "Today's unanswered-question count in Community, plus the Mon-Fri posting roster — admin only" },

    // Study Hub progress
    { method: "GET", path: "/api/study/reviewed", desc: "Get your reviewed Study Hub topic ids (logged-in users only — guests use local storage)" },
    { method: "POST", path: "/api/study/reviewed/{topicId}", desc: "Mark a Study Hub topic as reviewed" },
    { method: "DELETE", path: "/api/study/reviewed/{topicId}", desc: "Unmark a Study Hub topic as reviewed" },

    // JS Coding Questions
    { method: "GET", path: "/api/study/coding/usage", desc: "Get today's usage — questions generated vs. daily limit" },
    { method: "POST", path: "/api/study/coding/usage/bonus", desc: "Admin-only — grant yourself a one-off bump to today's daily limit" },
    { method: "POST", path: "/api/study/coding/generate", desc: "Generate a unique AI coding question with test cases at a given difficulty" },
    { method: "POST", path: "/api/study/coding/{id}/submit", desc: "Submit code — graded against real test cases in a sandbox, not by AI opinion" },
    { method: "POST", path: "/api/study/coding/{id}/reveal", desc: "Reveal the AI model answer, once you've submitted an attempt" },
    { method: "GET", path: "/api/study/coding/history", desc: "List your past coding questions and scores" },
    { method: "GET", path: "/api/study/coding/{id}", desc: "Full detail for a past question (used by History)" },
    { method: "POST", path: "/api/study/sql-query", desc: "AI Dev Assistant · SQL — plain English to a SQL query + explanation" },

    // Leave / Holiday — Work Board + Community rotation both respect this automatically
    { method: "POST", path: "/api/leaves", desc: "Submit a leave for a date range; notifies all admins" },
    { method: "GET", path: "/api/leaves/my", desc: "List your own leave requests" },
    { method: "DELETE", path: "/api/leaves/{id}", desc: "Cancel your own leave request" },
    { method: "GET", path: "/api/leaves/admin/upcoming", desc: "Admin only — leaves active today or upcoming" },

    // Dev Tools — API Tester proxy & Snippet Library
    { method: "POST", path: "/api/dev-tools/http-request", desc: "Proxy an outbound HTTP request server-side (supports raw/form-data/x-www-form-urlencoded bodies); private/internal addresses are blocked" },
    { method: "GET", path: "/api/dev-tools/snippets", desc: "List snippets — your own plus everyone's public ones" },
    { method: "POST", path: "/api/dev-tools/snippets", desc: "Save a new snippet; making it public notifies the whole team" },
    { method: "PATCH", path: "/api/dev-tools/snippets/{id}", desc: "Edit a snippet you own" },
    { method: "DELETE", path: "/api/dev-tools/snippets/{id}", desc: "Delete a snippet you own" },
    { method: "GET", path: "/api/dev-tools/snippets/languages", desc: "Distinct list of languages used, for the filter dropdown" },
    { method: "GET", path: "/api/dev-tools/mock/{resource}", desc: "Public, no-auth mock data generator — users/posts/products/todos/comments/images, deterministic per resource+count" },

    // Ask AI — general chat, prompt improver, image understanding, image generation, humanize
    { method: "POST", path: "/api/ai/ask", desc: "General-purpose AI chat / prompt-improver mode" },
    { method: "POST", path: "/api/ai/humanize", desc: "Rewrite pasted AI-generated text to sound more natural (max 1000 words)" },
    { method: "POST", path: "/api/ai/diagram", desc: "Turn a plain-English project/system description into a Mermaid.js diagram definition" },
    { method: "POST", path: "/api/ai/ask-image", desc: "Upload an image and ask about it — explain, describe, or extract text" },
    { method: "GET", path: "/api/ai/generate-image/usage", desc: "Today's text-to-image usage vs. daily limit" },
    { method: "POST", path: "/api/ai/generate-image", desc: "Generate an image from a text prompt (free, daily-limited)" },
    { method: "GET", path: "/api/ai/history", desc: "List your saved Ask AI chats" },
    { method: "POST", path: "/api/ai/history", desc: "Save or update a chat transcript" },
    { method: "DELETE", path: "/api/ai/history/{id}", desc: "Delete one saved chat" },

    // Notes — zero-knowledge encrypted, server never sees plaintext or the key
    { method: "GET", path: "/api/notes/salt", desc: "Get your encryption salt + verification blob (creates them on first use)" },
    { method: "POST", path: "/api/notes/verify-setup", desc: "Store the one-time passphrase verification blob (first-time setup only)" },
    { method: "GET", path: "/api/notes", desc: "List your notes (still encrypted — client decrypts)" },
    { method: "POST", path: "/api/notes", desc: "Create a note (client sends only ciphertext + IV)" },
    { method: "PATCH", path: "/api/notes/{id}", desc: "Update a note" },
    { method: "DELETE", path: "/api/notes/{id}", desc: "Delete a note" },

    // Meetings — free Jitsi-based video calls
    { method: "POST", path: "/api/meetings", desc: "Create/schedule a meeting and choose invitees (admin only)" },
    { method: "GET", path: "/api/meetings", desc: "List meetings — all of them for admins, only your invites otherwise" },
    { method: "GET", path: "/api/meetings/join/{code}", desc: "Look up a meeting by its join code — works for guests with no account at all" },
    { method: "GET", path: "/api/meetings/{id}", desc: "Get one meeting's details (must be admin or invited)" },
    { method: "PATCH", path: "/api/meetings/{id}/end", desc: "End a meeting for everyone (admin only)" },
    { method: "DELETE", path: "/api/meetings/{id}", desc: "Delete/cancel a meeting (admin only)" },

    // Recent Jobs — free public job board feed (disabled for now)
    // { method: "GET", path: "/api/jobs/recent", desc: "Recent tech job listings from the last 7 days (public, cached ~20 min)" },

    // Messages — private admin <-> user chat, only an admin can start a conversation
    { method: "POST", path: "/api/admin-chat/start", desc: "Start a private conversation with a user (admin only)" },
    { method: "GET", path: "/api/admin-chat/conversations", desc: "List your conversations — all of them for admins, only yours otherwise" },
    { method: "GET", path: "/api/admin-chat/users", desc: "List users you can start a new conversation with (admin only)" },
    { method: "GET", path: "/api/admin-chat/{chatId}/messages", desc: "Get a conversation's messages and mark unread ones as read" },
    { method: "POST", path: "/api/admin-chat/{chatId}/messages", desc: "Send a rich-text message and/or image in a conversation" },
    { method: "POST", path: "/api/admin-chat/{chatId}/messages/{messageId}/react", desc: "Toggle an emoji reaction on a message — broadcasts live to the other participant(s) over the chat WebSocket" },
    { method: "WS", path: "/api/admin-chat/ws", desc: "Real-time delivery of new messages (JWT via ?token= query param)" },

    // Project Chatbot — scoped to explaining this app only
    { method: "POST", path: "/api/project-chat/ask", desc: "Ask the in-app assistant about a Dev Life feature or how to get somewhere (open to guests)" },
    { method: "GET", path: "/api/project-chat/knowledge", desc: "The same feature/route knowledge the chatbot and Admin Features Doc both read from" },

    // Uploads — Cloudinary-backed, only the URL is ever stored
    { method: "POST", path: "/api/uploads/image", desc: "Upload an image (max 5MB); returns a URL — used by Profile pictures" },
  ];

  const methodColors = {
    GET: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    POST: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    PUT: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    PATCH: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    DELETE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    WS: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📚 API Documentation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dev Life API Reference</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Base URL</h2>
        <code className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm block text-slate-700 dark:text-slate-300">
          {window.location.origin}/api
        </code>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Endpoints</h2>
        {endpoints.map((endpoint, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-4 space-y-2"
          >
            <div className="flex items-start gap-3 flex-wrap">
              <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method]}`}>
                {endpoint.method}
              </span>
              <code className="text-sm text-slate-700 dark:text-slate-300 font-mono flex-1 min-w-0 break-all">{endpoint.path}</code>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{endpoint.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Authentication</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Include JWT token in Authorization header:
        </p>
        <code className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm block text-slate-700 dark:text-slate-300">
          Authorization: Bearer {'<token>'}
        </code>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Features</h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>✅ User authentication and profiles</li>
          <li>✅ Community question feed</li>
          <li>✅ Advanced search with filters</li>
          <li>✅ Comments and discussions</li>
          <li>✅ Question difficulty ratings</li>
          <li>✅ Gamification (points, badges, levels)</li>
          <li>✅ Timed challenges</li>
          <li>✅ User feedback system</li>
          <li>✅ Real-time notifications</li>
          <li>✅ Jira-style task management with role-gated status transitions</li>
          <li>✅ Daily Work Board standups with threaded replies</li>
          <li>✅ AI-generated coding questions, sandbox-graded against real test cases</li>
          <li>✅ Server-proxied API request tester with SSRF protection</li>
          <li>✅ Snippet library with team-wide public sharing</li>
          <li>✅ Study Hub progress synced per account, guest-safe fallback to local storage</li>
          <li>✅ Zero-knowledge encrypted personal Notes — server never sees plaintext or the key</li>
          <li>✅ Free video meetings (Jitsi) with admin-controlled invites plus a guest-friendly join code</li>
          <li>✅ Recent tech job listings from a free public source</li>
          <li>✅ In-app Project Chatbot scoped to explaining this app, with navigation help</li>
          <li>✅ Cloudinary-backed image uploads — only the URL is ever stored, never the image bytes</li>
          <li>✅ Scheduled/temporary user lockouts (hours/days/custom) that lift automatically</li>
          <li>✅ Admin-toggleable guest mode — full nav visible with locked items blurred, plus a login/signup/contact-admin prompt</li>
          <li>✅ Per-user notification snooze (1d/2d/1w/permanent), independent of the admin-wide kill switch</li>
          <li>✅ Force-update build tracking — admin can see who's on an old bundle after a deploy</li>
          <li>✅ AI-generated Mermaid diagrams from a plain-English project/system description</li>
          <li>✅ Daily 3-snippet Typing Race — same snippets for everyone, ranked by total time, canvas-rendered to resist copy/paste</li>
          <li>✅ Mini Sudoku — unlimited plays, choice of 6x6/7x7/8x8, ranked daily by cumulative marks</li>
          <li>✅ Points, badges, and daily streaks for Typing Race + Mini Sudoku, feeding the same profile level everywhere else uses</li>
          <li>✅ Emoji reactions (👍 ❤️ 😂 🎉 😮 👀) on Community questions and Messages, live over WebSocket for chat</li>
          <li>✅ Weekly digest notification — Monday summary of each user's game activity, skipped for anyone inactive that week</li>
        </ul>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pagination</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          List endpoints support pagination with query parameters:
        </p>
        <code className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm block text-slate-700 dark:text-slate-300">
          ?page=1&page_size=20
        </code>
      </div>
    </motion.div>
  );
}
