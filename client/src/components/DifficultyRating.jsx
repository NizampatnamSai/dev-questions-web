import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function DifficultyRating({ questionId, onRated }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(null);
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRating();
  }, [questionId]);

  const loadRating = async () => {
    try {
      const [userRating, statsData] = await Promise.all([
        user && !user.isGuest ? api.get(`/difficulty/questions/${questionId}/difficulty`) : Promise.resolve({ data: { difficulty: null } }),
        api.get(`/difficulty/questions/difficulty/stats/${questionId}`),
      ]);
      setRating(userRating.data.difficulty);
      setStats(statsData.data);
    } catch {
      // Silent fail
    }
  };

  const submitRating = async (difficulty) => {
    if (!user || user.isGuest) {
      toast.error("Sign in to rate difficulty");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/difficulty/questions/${questionId}/difficulty`, { difficulty });
      setRating(difficulty);
      await loadRating();
      toast.success("Rating saved!");
      onRated?.();
    } catch {
      toast.error("Failed to save rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">How difficult was this question?</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => submitRating(r)}
              disabled={submitting}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                rating === r
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900"
              } disabled:opacity-50`}
            >
              {"⭐".repeat(r)}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Community average: <strong>{stats.avgDifficulty}</strong>/5 ({stats.totalRatings} ratings)
          </p>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <div key={r} className="flex flex-col items-center gap-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-6 flex items-center justify-center overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full flex items-center justify-center text-xs text-white"
                    style={{
                      width: `${(stats.distribution[r] / stats.totalRatings) * 100}%`,
                    }}
                  >
                    {stats.distribution[r] > 0 && stats.distribution[r]}
                  </div>
                </div>
                <span className="text-xs text-slate-500">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
