import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useWeather } from "../context/WeatherContext";
import { STATES_CAPITALS } from "../data/statesCapitals";

const BASE_LINKS = [
  { to: "/dashboard",      label: "Dashboard",       icon: "📊" },
  { to: "/generate",       label: "AI Generator",    icon: "✨" },
  { to: "/quiz",           label: "Quiz Mode",       icon: "🧠" },
  { to: "/study",          label: "Study Hub",       icon: "📚" },
  { to: "/mock-interview", label: "Mock Interview",  icon: "🎯" },
  { to: "/flashcards",     label: "Flashcards",      icon: "🃏" },
  { to: "/progress",       label: "My Progress",     icon: "📈" },
  { to: "/community",      label: "Community",       icon: "🌍" },
  { to: "/my-questions",   label: "My Questions",    icon: "📝" },
  { to: "/bookmarks",      label: "Bookmarks",       icon: "🔖" },
  { to: "/leaderboard",    label: "Leaderboard",     icon: "🏆" },
];
const ADMIN_LINK = { to: "/admin", label: "Admin Panel", icon: "👑" };

function Toggle({ on, onToggle, color = "bg-indigo-500" }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`rounded-full relative transition-colors flex-shrink-0 ${on ? color : "bg-slate-200 dark:bg-slate-700"}`}
      style={{ height: 18, width: 32 }}
    >
      <motion.div
        className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow"
        animate={{ left: on ? "14px" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, snow, toggleSnow } = useTheme();
  const {
    enabled, toggleEnabled,
    manual, setManualCondition,
    manualLoc, setManualLocation,
    activeCondition, meta, CONDITION_META,
    temp, locName, loading, error, locDenied,
  } = useWeather();

  const [stateSearch, setStateSearch] = useState("");

  const links = user?.role === "admin" ? [...BASE_LINKS, ADMIN_LINK] : BASE_LINKS;

  const initials = user?.name
    ?.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  const isStormy = activeCondition === "stormy";
  const textMuted = isStormy
    ? "text-slate-300"
    : "text-slate-500 dark:text-slate-400";

  return (
    <aside className="hidden md:flex md:flex-col w-64 h-screen sticky top-0 sidebar-light glass border-r border-black/5 dark:border-white/10 p-5 overflow-y-auto">

      {/* Logo */}
      <motion.div
        className="flex items-center gap-2.5 mb-8 px-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo192.png" alt="DevQuiz" className="w-9 h-9 rounded-xl shadow-lg shadow-indigo-500/30" />
        <div>
          <p className="text-base font-bold tracking-tight gradient-text">DevQuiz</p>
          <p className="text-[10px] text-slate-400 -mt-0.5">AI Interview Platform</p>
        </div>
      </motion.div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {links.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.1 }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "nav-active-light shadow-sm"
                    : `${textMuted} hover:bg-black/5 dark:hover:bg-white/8`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-base"
                  >
                    {link.icon}
                  </motion.span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400"
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="border-t border-black/5 dark:border-white/10 pt-4 space-y-1.5">

        {/* Theme */}
        <div
          onClick={toggleTheme}
          role="button"
          className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${textMuted}`}
        >
          <motion.span key={theme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="text-base">
            {theme === "dark" ? "🌙" : "☀️"}
          </motion.span>
          <span className="flex-1 text-left">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          <Toggle on={theme === "dark"} onToggle={toggleTheme} color="bg-indigo-500" />
        </div>

        {/* Snow */}
        <div
          onClick={toggleSnow}
          role="button"
          className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${textMuted}`}
        >
          <motion.span
            animate={{ rotate: snow ? [0, 15, -15, 0] : 0 }}
            transition={{ duration: 0.5, repeat: snow ? Infinity : 0, repeatDelay: 2 }}
            className="text-base"
          >
            ❄️
          </motion.span>
          <span className="flex-1 text-left">Snowfall</span>
          <Toggle on={snow} onToggle={toggleSnow} color="bg-cyan-400" />
        </div>

        {/* Weather BG */}
        <div>
          <div
            onClick={toggleEnabled}
            role="button"
            className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${textMuted}`}
          >
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="text-base"
            >
              {activeCondition ? (meta?.icon ?? "🌤️") : "🌤️"}
            </motion.span>
            <div className="flex-1 text-left">
              <p>Weather BG</p>
              {enabled && activeCondition && (
                <p className="text-[10px] text-indigo-400 dark:text-cyan-400 -mt-0.5">
                  {meta?.icon} {meta?.label}{temp !== null ? ` · ${temp}°C` : ""}
                  {locName ? ` · ${locName}` : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Toggle on={enabled} onToggle={toggleEnabled} color="bg-emerald-500" />
              <motion.span
                animate={{ rotate: enabled ? 180 : 0 }}
                className={`text-xs ${textMuted}`}
              >▾</motion.span>
            </div>
          </div>

          {/* Weather panel — only visible when enabled */}
          <AnimatePresence>
            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mx-2 mb-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-3">

                  {/* ── Location section ── always visible when enabled ── */}
                  <div>
                    <p className={`text-[10px] font-medium uppercase tracking-wide mb-2 ${textMuted}`}>
                      📍 Location
                    </p>

                    {/* Loading */}
                    {loading && (
                      <p className="text-xs text-slate-400 animate-pulse mb-1.5">Fetching weather…</p>
                    )}

                    {/* Current location badge */}
                    {!loading && (locName || manualLoc) && (
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] text-indigo-500 dark:text-cyan-400 font-medium">
                          {manualLoc
                            ? `📍 ${manualLoc.capital}, ${manualLoc.state}`
                            : `📍 ${locName}`}
                          {temp !== null && ` · ${temp}°C`}
                        </p>
                        {manualLoc && (
                          <button
                            onClick={() => setManualLocation(null)}
                            className="text-[10px] text-slate-400 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                          >
                            ✕ GPS
                          </button>
                        )}
                      </div>
                    )}

                    {/* Denied warning */}
                    {locDenied && !manualLoc && (
                      <p className="text-[10px] text-amber-500 font-medium mb-1.5">
                        ⚠️ GPS denied — select a city below
                      </p>
                    )}

                    {/* Error */}
                    {error && !locDenied && (
                      <p className="text-xs text-red-400 mb-1.5">{error}</p>
                    )}

                    {/* Search */}
                    <input
                      value={stateSearch}
                      onChange={e => setStateSearch(e.target.value)}
                      placeholder="Search state or city…"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />

                    {/* State/capital list */}
                    <div className="max-h-32 overflow-y-auto rounded-lg mt-1 space-y-0.5">
                      {/* GPS option (if not denied) */}
                      {!locDenied && (
                        <button
                          onClick={() => { setManualLocation(null); setStateSearch(""); }}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-all ${
                            !manualLoc
                              ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-medium"
                              : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          📡 Use my GPS location
                        </button>
                      )}

                      {/* States list */}
                      {STATES_CAPITALS
                        .filter(s =>
                          !stateSearch ||
                          s.state.toLowerCase().includes(stateSearch.toLowerCase()) ||
                          s.capital.toLowerCase().includes(stateSearch.toLowerCase())
                        )
                        .map(s => (
                          <button
                            key={s.state}
                            onClick={() => { setManualLocation(s); setStateSearch(""); }}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-all ${
                              manualLoc?.state === s.state
                                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-medium"
                                : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            <span className="font-medium">{s.capital}</span>
                            <span className="text-slate-400 dark:text-slate-500 ml-1 text-[10px]">— {s.state}</span>
                          </button>
                        ))
                      }
                    </div>
                  </div>

                  {/* ── Condition override ── */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-3">
                    <p className={`text-[10px] font-medium uppercase tracking-wide mb-2 ${textMuted}`}>
                      Condition override
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => setManualCondition("")}
                        className={`text-xs py-1 px-1.5 rounded-lg transition-all text-center border ${
                          !manual
                            ? "border-indigo-400 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                            : "border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        🌡 Auto
                      </button>
                      {Object.entries(CONDITION_META).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => setManualCondition(key)}
                          className={`text-xs py-1 px-1.5 rounded-lg transition-all text-center border ${
                            manual === key
                              ? "border-indigo-400 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                              : "border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {val.icon} {val.label}
                        </button>
                      ))}
                    </div>
                    {manual && (
                      <p className={`text-[10px] mt-1.5 ${textMuted}`}>Override active — ignores location weather</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* APK Download */}
        <a
          href="/devquiz.apk"
          download="DevQuiz.apk"
          className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${textMuted}`}
        >
          <span className="text-base">📱</span>
          <span className="flex-1 text-left">Android App</span>
          <span className="text-[10px] font-semibold text-indigo-500 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">↓ APK</span>
        </a>

        {/* User */}
        <motion.div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer`}
          whileHover={{ x: 2 }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isStormy ? "text-slate-200" : "text-slate-700 dark:text-slate-200"}`}>
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400 capitalize truncate">{user?.role}</p>
          </div>
          <button onClick={logout} title="Logout" className="text-slate-300 hover:text-red-400 transition-colors text-lg">
            ⎋
          </button>
        </motion.div>
      </div>
    </aside>
  );
}
