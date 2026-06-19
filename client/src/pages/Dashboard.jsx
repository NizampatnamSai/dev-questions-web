import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats/dashboard").then(({ data }) => setStats(data));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening in the DevQuiz community.
          </p>
        </div>
        <Link
          to="/generate"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm transition"
        >
          ✨ Quick Generate
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon="📚" label="Total Questions" value={stats?.totalQuestions ?? "—"} accent="from-cyan-400 to-blue-500" />
        <StatsCard
          icon="🗂"
          label="Categories"
          value={stats?.byCategory?.length ?? "—"}
          accent="from-purple-400 to-pink-500"
        />
        <StatsCard
          icon="🎯"
          label="Levels covered"
          value={stats?.byLevel?.length ?? "—"}
          accent="from-amber-400 to-orange-500"
        />
        <StatsCard
          icon="👥"
          label="Community Posts"
          value={stats?.communityPosts ?? "—"}
          accent="from-emerald-400 to-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">By Category</h2>
          <div className="space-y-2">
            {stats?.byCategory?.map((c) => (
              <div key={c.category} className="flex items-center justify-between text-sm">
                <span>{c.category}</span>
                <span className="text-slate-400">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">By Level</h2>
          <div className="space-y-2">
            {stats?.byLevel?.map((l) => (
              <div key={l.level} className="flex items-center justify-between text-sm">
                <span>{l.level}</span>
                <span className="text-slate-400">{l.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">By Type</h2>
          <div className="space-y-2">
            {stats?.byType?.map((t) => (
              <div key={t.type} className="flex items-center justify-between text-sm">
                <span>{t.type === "Coding" ? "💻 Coding" : "🧩 Technical"}</span>
                <span className="text-slate-400">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="font-semibold mb-4">Recent Questions</h2>
        <div className="space-y-3">
          {stats?.recent?.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm border-b border-black/5 dark:border-white/5 pb-2 last:border-0">
              <div>
                <p className="font-medium">{r.question}</p>
                <p className="text-xs text-slate-400">
                  {r.category} · {r.level} · by {r.author}
                </p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 ml-3">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
