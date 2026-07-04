import { motion } from "framer-motion";

export default function APIDocumentation() {
  const endpoints = [
    { method: "POST", path: "/api/auth/register", desc: "Register new user" },
    { method: "POST", path: "/api/auth/login", desc: "Login user" },
    { method: "GET", path: "/api/questions/community", desc: "Get community questions" },
    { method: "POST", path: "/api/questions/create", desc: "Create new question" },
    { method: "GET", path: "/api/questions/search/advanced", desc: "Advanced search with filters" },
    { method: "GET", path: "/api/profile/my/profile", desc: "Get current user profile" },
    { method: "PATCH", path: "/api/profile/my/profile", desc: "Update user profile" },
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

    // Dev Tools — API Tester proxy & Snippet Library
    { method: "POST", path: "/api/dev-tools/http-request", desc: "Proxy an outbound HTTP request server-side (supports raw/form-data/x-www-form-urlencoded bodies); private/internal addresses are blocked" },
    { method: "GET", path: "/api/dev-tools/snippets", desc: "List snippets — your own plus everyone's public ones" },
    { method: "POST", path: "/api/dev-tools/snippets", desc: "Save a new snippet; making it public notifies the whole team" },
    { method: "PATCH", path: "/api/dev-tools/snippets/{id}", desc: "Edit a snippet you own" },
    { method: "DELETE", path: "/api/dev-tools/snippets/{id}", desc: "Delete a snippet you own" },
    { method: "GET", path: "/api/dev-tools/snippets/languages", desc: "Distinct list of languages used, for the filter dropdown" },
  ];

  const methodColors = {
    GET: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    POST: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    PUT: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    PATCH: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    DELETE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📚 API Documentation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">DevQuiz API Reference</p>
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
              <code className="text-sm text-slate-700 dark:text-slate-300 font-mono flex-1">{endpoint.path}</code>
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
