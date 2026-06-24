import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { fmtDateTime } from "../utils/time";

const TYPE_COLORS = {
  bug:         "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300",
  feature:     "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  improvement: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  other:       "bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300",
};
const TYPE_EMOJI = { bug: "🐛", feature: "✨", improvement: "⚡", other: "💬" };

export default function MyFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/feedback/my").then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">💬 My Feedback</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Feedback you've submitted and replies from the team.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="glass-card p-4 h-24 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-4xl mb-3">💭</p>
          <p className="font-semibold text-slate-700 dark:text-slate-200">No feedback yet</p>
          <p className="text-sm text-slate-400 mt-1">Use the feedback button at the bottom-right to share your thoughts.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] || TYPE_COLORS.other}`}>
                      {TYPE_EMOJI[item.type]} {item.type}
                    </span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < item.rating ? "text-yellow-400" : "text-slate-300 dark:text-slate-600"}`}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{fmtDateTime(item.createdAt)}</span>
                </div>

                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                </div>

                {item.reply && (
                  <div className="mt-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      💬 Reply from {item.replyBy || "Admin"}
                      {item.repliedAt && <span className="font-normal text-slate-400 ml-2">{fmtDateTime(item.repliedAt)}</span>}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item.reply}</p>
                  </div>
                )}

                {!item.reply && (
                  <p className="text-xs text-slate-400 italic">Awaiting reply from the team…</p>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
