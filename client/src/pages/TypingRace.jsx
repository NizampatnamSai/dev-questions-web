import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Draws the snippet onto a <canvas> instead of DOM text nodes — there's
// nothing to drag-select, right-click-copy, or find as plain text via
// Inspect Element this way (the raw snippet is still visible in the
// GET /game/typing-race/start network response to anyone opening devtools'
// Network tab, which no frontend trick can hide — this just closes off the
// casual "select all, copy, paste" and "view page source" routes).
function SnippetCanvas({ snippet, typed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const [width, setWidth] = useState(600);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !snippet || width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    const fontSize = 15;
    const lineHeight = 26;
    const paddingX = 16;
    const font = `${fontSize}px "SFMono-Regular", Menlo, Consolas, monospace`;

    ctx.font = font;
    const charWidth = ctx.measureText("M").width;
    const charsPerLine = Math.max(1, Math.floor((width - paddingX * 2) / charWidth));
    const lines = [];
    for (let i = 0; i < snippet.length; i += charsPerLine) {
      lines.push(snippet.slice(i, i + charsPerLine));
    }
    const height = lines.length * lineHeight + 24;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.font = font;
    ctx.textBaseline = "middle";

    const isDark = theme === "dark";
    ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9"; // slate-800 / slate-100
    ctx.fillRect(0, 0, width, height);

    let idx = 0;
    lines.forEach((line, li) => {
      const y = 16 + li * lineHeight + lineHeight / 2;
      for (let ci = 0; ci < line.length; ci++) {
        const ch = line[ci];
        const x = paddingX + ci * charWidth;
        let color = isDark ? "#64748b" : "#94a3b8"; // untyped: slate-500/400
        if (idx < typed.length) {
          color = typed[idx] === ch ? "#10b981" : "#ef4444"; // emerald-500 / red-500
          if (typed[idx] !== ch) {
            ctx.fillStyle = "rgba(239,68,68,0.15)";
            ctx.fillRect(x, y - lineHeight / 2, charWidth, lineHeight);
          }
        } else if (idx === typed.length) {
          color = isDark ? "#e2e8f0" : "#334155"; // cursor position
          ctx.fillStyle = color;
          ctx.fillRect(x, y + lineHeight / 2 - 3, charWidth, 2); // underline
        }
        ctx.fillStyle = color;
        ctx.fillText(ch, x, y);
        idx++;
      }
    });
  }, [snippet, typed, width, theme]);

  return (
    <div ref={containerRef} onContextMenu={(e) => e.preventDefault()} className="rounded-xl overflow-hidden select-none">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

const TOTAL_SNIPPETS = 3;

export default function TypingRace() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [completed, setCompleted] = useState([]); // [{index, wpm, accuracy, timeMs}] already submitted today
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [lastResult, setLastResult] = useState(null); // result of the snippet just submitted, shown before "Next"
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roster, setRoster] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const inputRef = useRef(null);

  const currentIndex = completed.length;
  const allDone = currentIndex >= TOTAL_SNIPPETS;

  // Single combined payload (snippets + my progress + full roster) instead
  // of 3 separate round trips for data that's all needed on first paint —
  // same "one /board call" pattern WorkBoard uses.
  const loadBoard = () => {
    setLoadingBoard(true);
    api
      .get("/game/typing-race/board")
      .then(({ data }) => {
        setSnippets(data.snippets);
        setCompleted(data.completed);
        setRoster(data.roster);
      })
      .catch(() => toast.error("Failed to load today's Typing Race"))
      .finally(() => {
        setLoading(false);
        setLoadingBoard(false);
      });
  };

  useEffect(() => {
    loadBoard();
  }, []);

  useEffect(() => {
    if (!loading && !allDone) setTimeout(() => inputRef.current?.focus(), 50);
  }, [loading, currentIndex, allDone]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!startedAt && val.length > 0) setStartedAt(Date.now());
    setTyped(val);
  };

  const submit = async () => {
    if (!startedAt || submitting || typed !== snippets[currentIndex]) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/game/typing-race/submit", {
        snippetIndex: currentIndex,
        timeMs: Date.now() - startedAt,
        typed,
      });
      setCompleted((prev) => [...prev, { index: currentIndex, wpm: data.wpm, timeMs: Date.now() - startedAt }]);
      setLastResult(data);
      setTyped("");
      setStartedAt(null);
      loadBoard();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit score");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    setLastResult(null);
  };

  const totalTimeMs = completed.reduce((sum, c) => sum + c.timeMs, 0);

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto text-slate-800 dark:text-white">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">⌨️</div>
        <h1 className="text-3xl font-bold mb-2">Typing Race</h1>
        <p className="text-slate-500 dark:text-slate-400">
          3 snippets a day, same for everyone — one shot each, ranked by total time. No skipping.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-6">Loading today's snippets…</p>
        ) : allDone ? (
          <div className="text-center py-6 space-y-3">
            <div className="text-4xl">🏁</div>
            <p className="font-bold text-lg">All 3 done for today!</p>
            <p className="text-sm text-slate-400">
              Total time: <span className="font-bold text-indigo-500">{(totalTimeMs / 1000).toFixed(1)}s</span>
            </p>
            <p className="text-xs text-slate-400">Come back tomorrow for 3 new snippets.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Snippet {currentIndex + 1} of {TOTAL_SNIPPETS}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: TOTAL_SNIPPETS }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < currentIndex ? "bg-emerald-500" : i === currentIndex ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {lastResult ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10"
              >
                <div className="flex gap-6 items-center">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="text-xs text-slate-400">Speed</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{lastResult.wpm} WPM</p>
                  </div>
                </div>
                <button
                  onClick={next}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Next →
                </button>
              </motion.div>
            ) : (
              <>
                <SnippetCanvas snippet={snippets[currentIndex] || ""} typed={typed} />

                <textarea
                  ref={inputRef}
                  value={typed}
                  onChange={handleChange}
                  onPaste={(e) => { e.preventDefault(); toast.error("No pasting — type it out!"); }}
                  onDrop={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    // Blocks the Ctrl/Cmd+V shortcut itself, not just the resulting
                    // paste event — belt-and-suspenders since some mobile browsers'
                    // "paste from clipboard" keyboard-toolbar action fires this
                    // differently than a real paste event.
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
                      e.preventDefault();
                      return;
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  rows={3}
                  placeholder="Start typing here…"
                  className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
                />

                <div className="flex items-center justify-end gap-3">
                  {typed.length > 0 && typed !== snippets[currentIndex] && (
                    <span className="text-xs text-red-400">Not an exact match yet</span>
                  )}
                  <button
                    onClick={submit}
                    disabled={typed !== snippets[currentIndex] || submitting}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      typed === snippets[currentIndex] && !submitting
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {submitting ? "Submitting…" : "Submit ✓"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="glass-card p-6 mt-6">
        <h2 className="text-lg font-bold mb-3">🏆 Today's Team</h2>
        {loadingBoard ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : roster.length === 0 ? (
          <p className="text-sm text-slate-400">No team members yet.</p>
        ) : (
          <div className="space-y-1.5">
            {roster.map((r) => (
              <div
                key={r.userId}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl flex-wrap sm:flex-nowrap ${
                  r.userId === user?.id ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                } ${r.status === "not_played" ? "opacity-60" : ""}`}
              >
                <span className="w-6 text-sm font-bold text-slate-400 flex-shrink-0">
                  {r.status === "ranked" ? (r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : r.rank) : "—"}
                </span>
                {r.avatar ? (
                  <img src={r.avatar} alt={r.userName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                    {r.userName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="flex-1 min-w-[80px] text-sm font-medium truncate">{r.userName}</span>
                {r.status === "ranked" && (
                  <span className="w-full sm:w-auto pl-9 sm:pl-0 flex items-center gap-3">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{(r.totalTimeMs / 1000).toFixed(1)}s total</span>
                    <span className="text-sm font-bold text-indigo-500 whitespace-nowrap">{r.avgWpm} WPM avg</span>
                  </span>
                )}
                {r.status === "in_progress" && (
                  <span className="text-xs text-amber-500 font-medium whitespace-nowrap">{r.doneCount}/{TOTAL_SNIPPETS} done</span>
                )}
                {r.status === "not_played" && (
                  <span className="text-xs text-slate-400 italic whitespace-nowrap">Not played today</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
