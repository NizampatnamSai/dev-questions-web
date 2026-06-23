import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

function initialsOf(name = "?") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/leaderboard")
      .then(({ data }) => setRows(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxQ = Math.max(...rows.map(r => r.questionsPosted || r.questionCount || 0), 1);
  const maxU = Math.max(...rows.map(r => r.upvotesReceived || r.totalUpvotes || 0), 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🏆 Leaderboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ranked by total questions posted — upvotes show community appreciation.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Questions posted</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block" /> Upvotes received</span>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-6 bg-slate-200 dark:bg-slate-700 rounded flex-shrink-0" />
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-44" />
                </div>
                <div className="space-y-1 w-32 hidden sm:block">
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center py-12 text-slate-400">No data yet — start posting questions!</p>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {rows.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="p-4 flex items-center gap-4"
              >
                <div className="w-8 text-center text-lg font-bold flex-shrink-0">
                  {MEDALS[i] || <span className="text-sm text-slate-400">#{i + 1}</span>}
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-xs flex items-center justify-center text-white font-bold flex-shrink-0">
                    {initialsOf(r.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{r.name}</p>
                    <p className="text-xs text-slate-400 truncate">{r.email}</p>
                  </div>
                </div>
                {/* Stats bars */}
                <div className="flex-1 max-w-[200px] space-y-1.5 hidden sm:block">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>📝 Questions</span>
                      <span className="font-bold text-indigo-500">{r.questionsPosted ?? r.questionCount ?? 0}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-indigo-500 rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${((r.questionsPosted || r.questionCount || 0) / maxQ) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>▲ Upvotes</span>
                      <span className="font-bold text-cyan-500">{r.upvotesReceived ?? r.totalUpvotes ?? 0}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-cyan-400 rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${((r.upvotesReceived || r.totalUpvotes || 0) / maxU) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 + 0.1 }} />
                    </div>
                  </div>
                </div>
                {/* Mobile: numbers only */}
                <div className="sm:hidden text-right flex-shrink-0">
                  <p className="text-sm font-bold text-indigo-500">{r.questionsPosted ?? r.questionCount ?? 0} <span className="text-[10px] font-normal text-slate-400">Q</span></p>
                  <p className="text-xs text-cyan-500">{r.upvotesReceived ?? r.totalUpvotes ?? 0} <span className="text-[10px] text-slate-400">▲</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
