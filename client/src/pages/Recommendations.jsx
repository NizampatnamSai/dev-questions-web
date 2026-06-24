import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

export default function Recommendations() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("trending"); // trending, by-difficulty, weak-areas

  useEffect(() => {
    loadRecommendations();
  }, [filter]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/questions/recommendations", {
        params: { type: filter, limit: 20 }
      });
      setQuestions(Array.isArray(data) ? data : data.items || []);
    } catch {
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">💡 Recommended for You</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Personalized question recommendations based on your activity</p>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "trending", label: "🔥 Trending" },
          { id: "by-difficulty", label: "📊 By Difficulty" },
          { id: "weak-areas", label: "⚠️ Weak Areas" }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Questions grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-24 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg mb-2">📭</p>
          <p>No recommendations available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map(q => (
            <QuestionCard key={q.id} q={q} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
