import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS = ["Low", "Medium", "High"];

export default function AdvancedSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    level: "",
    author: "",
    min_difficulty: "",
    max_difficulty: "",
    date_from: "",
    date_to: "",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const search = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, page_size: 20 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const { data } = await api.get("/questions/search/advanced", { params });
      setResults(data.items);
      setTotal(data.total);
      setPage(p);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!filters.query && !filters.category && !filters.level && !filters.author) {
      toast.error("Enter at least one search criterion");
      return;
    }
    setPage(1);
    search(1);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🔍 Advanced Search</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find questions with detailed filters</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search query..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Author name..."
            value={filters.author}
            onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filters.level}
            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Min difficulty (1-5)"
            min="1"
            max="5"
            value={filters.min_difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, min_difficulty: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Max difficulty (1-5)"
            min="1"
            max="5"
            value={filters.max_difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, max_difficulty: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Found <strong>{total}</strong> results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex gap-2 justify-center pt-4">
              <button
                onClick={() => search(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <button
                onClick={() => search(page + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && results.length === 0 && Object.values(filters).some(v => v) && (
        <div className="text-center py-12">
          <p className="text-slate-700 dark:text-slate-400 text-lg">No questions found</p>
          <p className="text-slate-600 dark:text-slate-500 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </motion.div>
  );
}
