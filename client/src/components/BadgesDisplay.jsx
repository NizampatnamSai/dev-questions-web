import { useState, useEffect } from "react";
import api from "../api/axios";

const BADGE_INFO = {
  first_post: { icon: "📝", name: "First Post", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
  first_answer: { icon: "✍️", name: "First Answer", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
  community_star: { icon: "⭐", name: "Community Star", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" },
  knowledge_seeker: { icon: "📚", name: "Knowledge Seeker", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
  helpful: { icon: "🤝", name: "Helpful", color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300" },
  streak_week: { icon: "🔥", name: "Weekly Streak", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
  streak_month: { icon: "🔥🔥", name: "Monthly Streak", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" },
  level_5: { icon: "🎯", name: "Level 5", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" },
  level_10: { icon: "🏆", name: "Level 10", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
};

export default function BadgesDisplay({ userId, compact = false }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    try {
      const endpoint = userId ? `/profile/profile/${userId}` : `/profile/my/profile`;
      const { data } = await api.get(endpoint);
      setBadges(data.badges || []);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  if (loading || badges.length === 0) return null;

  return (
    <div className={compact ? "flex gap-2 flex-wrap" : "space-y-4"}>
      {!compact && <h3 className="font-semibold text-slate-800 dark:text-slate-100">🏆 Badges ({badges.length})</h3>}
      <div className={compact ? "flex gap-2 flex-wrap" : "grid grid-cols-2 sm:grid-cols-4 gap-3"}>
        {badges.map((badge) => {
          const info = BADGE_INFO[badge];
          return (
            <div
              key={badge}
              title={info?.name}
              className={`${info?.color} p-3 rounded-lg text-center ${compact ? "p-1 text-xl" : ""}`}
            >
              <div className={compact ? "" : "text-3xl mb-2"}>{info?.icon || "🎖️"}</div>
              {!compact && <div className="text-xs font-semibold">{info?.name}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
