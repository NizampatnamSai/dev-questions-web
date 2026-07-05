import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const AUDIENCE_STYLE = {
  all:   { label: "Everyone (incl. guests)", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" },
  user:  { label: "Logged-in users", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" },
  admin: { label: "Admin only", cls: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300" },
};

export default function AdminFeaturesDoc() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/project-chat/knowledge")
      .then(({ data }) => setData(data))
      .catch(() => toast.error("Failed to load features doc"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading…</div>;
  if (!data) return <div className="text-center py-20 text-slate-400">Failed to load.</div>;

  const routes = data.routes.filter((r) => {
    if (filter !== "all" && r.audience !== filter) return false;
    if (search && !`${r.label} ${r.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📖 Features & Docs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Every page and feature currently shipped, who can access it, and how it works behind the scenes.
          This is the same source the in-app Project Chatbot uses, so both always stay in sync.
        </p>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">{data.summary}</p>
      </div>

      {data.pythonArchitecture && Object.keys(data.pythonArchitecture).length > 0 && (
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">🐍 How the Python Backend Works</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Written for a frontend dev who knows web concepts but not FastAPI/Python backend patterns
              specifically — useful context for interviews too.
            </p>
          </div>
          {Object.entries(data.pythonArchitecture).map(([key, text]) => (
            <div key={key} className="glass-card p-4">
              <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm mb-1 capitalize">
                {key.replace(/_/g, " ")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search features…"
          className="flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {["all", "user", "admin"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
              filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {f === "all" ? "All audiences" : AUDIENCE_STYLE[f].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {routes.map((r) => (
          <div key={r.path} className="glass-card p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{r.label}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${AUDIENCE_STYLE[r.audience]?.cls || ""}`}>
                  {AUDIENCE_STYLE[r.audience]?.label || r.audience}
                </span>
                <code className="text-[10px] text-slate-400">{r.path}</code>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{r.description}</p>
            {r.python && (
              <div className="mt-2.5 pt-2.5 border-t border-black/5 dark:border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  🐍 Python / Backend
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{r.python}</p>
              </div>
            )}
          </div>
        ))}
        {routes.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">No features match your filter.</p>
        )}
      </div>

      {Object.keys(data.behindTheScenes || {}).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">⚙️ Behind the Scenes</h2>
          {Object.entries(data.behindTheScenes).map(([key, text]) => (
            <div key={key} className="glass-card p-4">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-1 capitalize">
                {key.replace(/_/g, " ")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
