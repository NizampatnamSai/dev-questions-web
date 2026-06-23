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
  ];

  const methodColors = {
    GET: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    POST: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
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
