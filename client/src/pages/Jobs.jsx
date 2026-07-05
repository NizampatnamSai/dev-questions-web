import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    api.get("/jobs/recent")
      .then(({ data }) => {
        setJobs(data.jobs || []);
        setMeta(data);
        if (data.stale) toast("Showing recently cached listings — live feed is temporarily unavailable.", { icon: "⚠️" });
      })
      .catch(() => toast.error("Failed to load job listings"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    if (remoteOnly && !j.remote) return false;
    if (search && !`${j.title} ${j.company} ${j.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">💼 Recent Tech Jobs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real, live listings from the last 7 days — filtered to tech/dev roles. A direct Google Jobs feed
          isn't publicly available for free, so this uses{" "}
          <a href="https://www.arbeitnow.com" target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
            Arbeitnow's
          </a>{" "}
          free public job board API instead.
        </p>
        <p className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mt-2">
          ⚠️ Note: this source is Germany/Europe-focused and currently has no India listings —
          a proper India feed needs a different provider (e.g. Adzuna) with its own free API key. Revisiting later.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, company, or tag…"
          className="flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => setRemoteOnly((v) => !v)}
          className={`text-xs px-3 py-2 rounded-xl font-semibold transition-colors ${
            remoteOnly ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          🌍 Remote only
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="glass-card h-24 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-2">💼</p>
          <p>No matching jobs from the last 7 days right now — check back soon, listings update hourly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((j, i) => (
            <a
              key={i}
              href={j.url}
              target="_blank"
              rel="noreferrer"
              className="glass-card p-4 flex flex-col gap-1.5 hover:ring-2 hover:ring-indigo-500/40 transition-all"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{j.title}</h3>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{timeAgo(j.postedAt)}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {j.company} {j.location && `· ${j.location}`} {j.remote && "· 🌍 Remote"}
              </p>
              {j.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {j.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
