import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const ROADMAPS = {
  javascript: {
    title: "JavaScript Roadmap",
    icon: "📜",
    stages: [
      { level: "Beginner", topics: ["Basics", "Variables", "Functions", "DOM"], progress: 75 },
      { level: "Intermediate", topics: ["Async/Await", "ES6+", "Closures", "Prototypes"], progress: 50 },
      { level: "Advanced", topics: ["Design Patterns", "Performance", "Security"], progress: 25 },
    ]
  },
  react: {
    title: "React Roadmap",
    icon: "⚛️",
    stages: [
      { level: "Beginner", topics: ["JSX", "Components", "Props", "State"], progress: 80 },
      { level: "Intermediate", topics: ["Hooks", "Context", "Forms", "Routing"], progress: 60 },
      { level: "Advanced", topics: ["Performance", "Testing", "Advanced Patterns"], progress: 30 },
    ]
  },
  nodejs: {
    title: "Node.js Roadmap",
    icon: "🟢",
    stages: [
      { level: "Beginner", topics: ["Setup", "Modules", "File System", "HTTP"], progress: 60 },
      { level: "Intermediate", topics: ["Express", "Databases", "Async", "APIs"], progress: 40 },
      { level: "Advanced", topics: ["Scaling", "Security", "Microservices"], progress: 15 },
    ]
  },
};

const RoadmapCard = ({ category, data, onViewDetails }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 space-y-4"
  >
    <div className="flex items-center gap-3">
      <span className="text-3xl">{data.icon}</span>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.title}</h2>
    </div>

    <div className="space-y-4">
      {data.stages.map((stage, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{stage.level}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{stage.progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all ${
                stage.progress >= 70 ? "bg-emerald-500" :
                stage.progress >= 40 ? "bg-amber-500" :
                "bg-red-500"
              }`}
              style={{ width: `${stage.progress}%` }}
            />
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2">
            {stage.topics.map((topic, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {topic}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <button
      onClick={e => { e.stopPropagation(); onViewDetails?.(); }}
      className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
    >
      Study This Roadmap →
    </button>
  </motion.div>
);

export default function CategoryRoadmap() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (selectedCategory && ROADMAPS[selectedCategory]) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
        >
          ← Back to all roadmaps
        </button>
        <RoadmapCard
          category={selectedCategory}
          data={ROADMAPS[selectedCategory]}
          onViewDetails={() => navigate("/study")}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🗺️ Learning Roadmaps</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Structured learning paths for each category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(ROADMAPS).map(([key, data]) => (
          <div key={key} onClick={() => setSelectedCategory(key)} className="cursor-pointer">
            <RoadmapCard
              category={key}
              data={data}
              onViewDetails={() => { setSelectedCategory(key); }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
