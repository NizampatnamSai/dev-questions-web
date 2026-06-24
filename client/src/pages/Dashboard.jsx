import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../context/AuthContext";
import { fmtDateTime as fmtDate } from "../utils/time";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats/dashboard").then(({ data }) => setStats(data));
  }, []);

  const loading = !stats;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening in the DevQuiz community.</p>
        </div>
        <Link to="/generate" className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm transition">
          ✨ Quick Generate
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        )) : (
          <>
            <StatsCard icon="📚" label="Total Questions" value={stats.totalQuestions ?? 0} accent="from-cyan-400 to-blue-500" />
            <StatsCard icon="🗂" label="Categories" value={stats.byCategory?.length ?? 0} accent="from-purple-400 to-pink-500" />
            <StatsCard icon="🎯" label="Levels covered" value={stats.byLevel?.length ?? 0} accent="from-amber-400 to-orange-500" />
            <StatsCard icon="👥" label="Community Posts" value={stats.communityPosts ?? 0} accent="from-emerald-400 to-teal-500" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {["By Category", "By Level", "By Type"].map((title, i) => (
          <div key={title} className="glass-card p-5">
            <h2 className="font-semibold mb-4">{title}</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between gap-3">
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {i === 0 && stats.byCategory?.map((c) => (
                  <div key={c.category} className="flex items-center justify-between text-sm">
                    <span>{c.category}</span><span className="text-slate-400">{c.count}</span>
                  </div>
                ))}
                {i === 1 && stats.byLevel?.map((l) => (
                  <div key={l.level} className="flex items-center justify-between text-sm">
                    <span>{l.level}</span><span className="text-slate-400">{l.count}</span>
                  </div>
                ))}
                {i === 2 && stats.byType?.map((t) => (
                  <div key={t.type} className="flex items-center justify-between text-sm">
                    <span>{t.type === "Coding" ? "💻 Coding" : "🧩 Technical"}</span>
                    <span className="text-slate-400">{t.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent questions */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-4">Recent Questions</h2>
        <div className="space-y-3">
          {loading ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-16 flex-shrink-0" />
            </div>
          )) : stats.recent?.map((r) => (
            <Link key={r.id} to={`/question/${r.id}`}
              className="flex items-center justify-between text-sm border-b border-black/5 dark:border-white/5 pb-2 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition cursor-pointer">
              <div>
                <p className="font-medium">{r.question}</p>
                <p className="text-xs text-slate-400">{r.category} · {r.level} · by {r.author}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 ml-3">{fmtDate(r.createdAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
