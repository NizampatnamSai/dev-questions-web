import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useWeather } from "../context/WeatherContext";
import { STATES_CAPITALS } from "../data/statesCapitals";

const FEATURE_LINKS = [
  { to: "/ask",                  icon: "🤖", label: "Ask AI",          sub: "Ask anything — Python, Claude…" },
  { to: "/notifications",        icon: "🔔", label: "Notifications",   sub: "Alerts & study reminders" },
  { to: "/mock-interview",       icon: "🎯", label: "Mock Interview",  sub: "AI-scored interview simulation" },
  { to: "/flashcards",           icon: "🃏", label: "Flashcards",      sub: "Flip & swipe to review topics" },
  { to: "/progress",             icon: "📈", label: "My Progress",     sub: "Streak, weak areas & readiness" },
  { to: "/my-questions",         icon: "📝", label: "My Questions",    sub: "Questions you created" },
  { to: "/drafts",               icon: "💾", label: "Drafts",           sub: "Saved — post when ready" },
  { to: "/bookmarks",            icon: "🔖", label: "Bookmarks",       sub: "Saved questions" },
  { to: "/leaderboard",          icon: "🏆", label: "Leaderboard",     sub: "Top contributors" },
  { to: "/js-compiler",          icon: "⚡", label: "JS Compiler",     sub: "Run JavaScript in browser" },
  { to: "/json-parser",          icon: "🔍", label: "JSON Parser",     sub: "Format, minify & validate JSON" },
  { to: "/study?tool=ts",        icon: "🔷", label: "TS Adder",        sub: "Add TypeScript types to JS" },
  { to: "/study?tool=errors",    icon: "🐛", label: "Error Finder",    sub: "Find bugs in your code" },
  { to: "/study?tool=breaks",    icon: "💥", label: "Break Finder",    sub: "Spot runtime risks" },
  { to: "/guide",                icon: "🗺️", label: "Project Guide",   sub: "How to use every feature" },
  { to: "/challenge",            icon: "🧩", label: "JS Challenge",     sub: "30-day advanced JS questions" },
  { to: "/workboard",            icon: "📋", label: "Work Board",       sub: "Daily standup board" },
];

function Toggle({ on, onToggle, color = "bg-indigo-500" }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`rounded-full relative transition-colors flex-shrink-0 ${on ? color : "bg-slate-200 dark:bg-slate-700"}`}
      style={{ height: 22, width: 38 }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: on ? "18px" : "3px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function MobileSettingsSheet({ open, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, snow, toggleSnow } = useTheme();
  const navigate = useNavigate();
  const {
    enabled, toggleEnabled,
    manual, setManualCondition,
    manualLoc, setManualLocation,
    activeCondition, meta, CONDITION_META,
    temp, locName, locDenied,
  } = useWeather();

  const [stateSearch, setStateSearch] = useState("");

  const initials = user?.name
    ?.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => { onClose(); logout(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[999] rounded-t-3xl glass border-t border-black/5 dark:border-white/10 max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="px-5 pb-8 pt-2 space-y-1">
              {/* Features section */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1 mb-2">
                Features
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {FEATURE_LINKS.map((f) => (
                  <button
                    key={f.to}
                    onClick={() => { onClose(); navigate(f.to); }}
                    className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-left transition-all cursor-pointer"
                  >
                    <span className="text-xl flex-shrink-0">{f.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{f.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{f.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-black/5 dark:border-white/10 mb-3" />

              {/* Header */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1 mb-3">
                Settings
              </p>

              {/* User card */}
              <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-black/5 dark:bg-white/5 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shadow flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Dark Mode */}
              <div
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/8 cursor-pointer transition-all"
              >
                <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                  <p className="text-xs text-slate-400">Toggle appearance</p>
                </div>
                <Toggle on={theme === "dark"} onToggle={toggleTheme} color="bg-indigo-500" />
              </div>

              {/* Snowfall */}
              <div
                onClick={toggleSnow}
                className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/8 cursor-pointer transition-all"
              >
                <span className="text-xl">❄️</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Snowfall</p>
                  <p className="text-xs text-slate-400">Animated snow overlay</p>
                </div>
                <Toggle on={snow} onToggle={toggleSnow} color="bg-cyan-400" />
              </div>

              {/* Weather BG */}
              <div
                onClick={toggleEnabled}
                className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/8 cursor-pointer transition-all"
              >
                <span className="text-xl">{activeCondition ? (meta?.icon ?? "🌤️") : "🌤️"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Weather BG</p>
                  <p className="text-xs text-slate-400">
                    {enabled && activeCondition
                      ? `${meta?.label}${temp !== null ? ` · ${temp}°C` : ""}${locName ? ` · ${locName}` : ""}`
                      : "Dynamic background"}
                  </p>
                </div>
                <Toggle on={enabled} onToggle={toggleEnabled} color="bg-emerald-500" />
              </div>

              {/* Weather panel — city + condition when enabled */}
              <AnimatePresence>
                {enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-1 p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-3">
                      {/* Location */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">📍 Location</p>
                        {!locDenied && (locName || manualLoc) && (
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-indigo-500 dark:text-cyan-400 font-medium">
                              {manualLoc ? `📍 ${manualLoc.capital}, ${manualLoc.state}` : `📍 ${locName}`}
                              {temp !== null && ` · ${temp}°C`}
                            </p>
                            {manualLoc && (
                              <button onClick={() => setManualLocation(null)} className="text-[10px] text-slate-400 hover:text-red-400 transition-colors ml-2">
                                ✕ GPS
                              </button>
                            )}
                          </div>
                        )}
                        {locDenied && !manualLoc && (
                          <p className="text-[10px] text-amber-500 font-medium mb-1.5">⚠️ GPS denied — select a city below</p>
                        )}
                        <input
                          value={stateSearch}
                          onChange={e => setStateSearch(e.target.value)}
                          placeholder="Search state or city…"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 outline-none focus:border-indigo-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        <div className="max-h-28 overflow-y-auto rounded-xl mt-1 space-y-0.5">
                          {!locDenied && (
                            <button
                              onClick={() => { setManualLocation(null); setStateSearch(""); }}
                              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-all ${!manualLoc ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-medium" : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"}`}
                            >
                              📡 Use my GPS location
                            </button>
                          )}
                          {STATES_CAPITALS
                            .filter(s => !stateSearch || s.state.toLowerCase().includes(stateSearch.toLowerCase()) || s.capital.toLowerCase().includes(stateSearch.toLowerCase()))
                            .map(s => (
                              <button
                                key={s.state}
                                onClick={() => { setManualLocation(s); setStateSearch(""); }}
                                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-all ${manualLoc?.state === s.state ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-medium" : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"}`}
                              >
                                <span className="font-medium">{s.capital}</span>
                                <span className="text-slate-400 ml-1 text-[10px]">— {s.state}</span>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Condition override */}
                      <div className="border-t border-black/5 dark:border-white/5 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Condition override</p>
                        <div className="grid grid-cols-4 gap-1">
                          <button
                            onClick={() => setManualCondition("")}
                            className={`text-xs py-1.5 px-1 rounded-xl transition-all text-center border ${!manual ? "border-indigo-400 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" : "border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-500"}`}
                          >
                            🌡 Auto
                          </button>
                          {Object.entries(CONDITION_META).map(([key, val]) => (
                            <button
                              key={key}
                              onClick={() => setManualCondition(key)}
                              className={`text-xs py-1.5 px-1 rounded-xl transition-all text-center border ${manual === key ? "border-indigo-400 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" : "border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-500"}`}
                            >
                              {val.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="border-t border-black/5 dark:border-white/10 my-2" />

              {/* APK Download */}
              <a
                href="/devquiz.apk"
                download="DevQuiz.apk"
                className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/8 cursor-pointer transition-all"
                onClick={onClose}
              >
                <span className="text-xl">📱</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Download Android App</p>
                  <p className="text-xs text-slate-400">DevQuiz.apk · Android</p>
                </div>
                <span className="text-xs font-semibold text-indigo-500 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg">↓ APK</span>
              </a>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-all text-left"
              >
                <span className="text-xl">⎋</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-500">Logout</p>
                  <p className="text-xs text-slate-400">Sign out of your account</p>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
