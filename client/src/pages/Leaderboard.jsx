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

  useEffect(() => {
    api.get("/stats/leaderboard").then(({ data }) => setRows(data));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🏆 Leaderboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Top contributors in the DevQuiz community.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-black/5 dark:border-white/10">
              <th className="p-4">Rank</th>
              <th className="p-4">Contributor</th>
              <th className="p-4 text-right">Questions</th>
              <th className="p-4 text-right">Upvotes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-black/5 dark:border-white/5 last:border-0"
              >
                <td className="p-4 font-semibold">{MEDALS[i] || `#${i + 1}`}</td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-xs flex items-center justify-center text-white font-bold">
                    {initialsOf(r.name)}
                  </div>
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.email}</p>
                  </div>
                </td>
                <td className="p-4 text-right font-semibold">{r.questionCount}</td>
                <td className="p-4 text-right text-slate-400">{r.totalUpvotes}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
