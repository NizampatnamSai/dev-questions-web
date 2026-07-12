import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Mirrors server-side SUDOKU_BOX_DIMS in routers/game.py — 7 is prime, so a
// 7x7 board has no clean rectangular box subdivision and is played as a
// pure Latin square (row/column uniqueness only, no box rule).
const BOX_DIMS = { 6: [2, 3], 7: null, 8: [2, 4] };
const SIZES = [6, 7, 8];

function getConflicts(grid, size, boxDims) {
  const conflicts = new Set();
  const markDupes = (cells) => {
    const seen = new Map();
    for (const [r, c, v] of cells) {
      if (!v) continue;
      if (seen.has(v)) {
        conflicts.add(seen.get(v));
        conflicts.add(`${r}-${c}`);
      } else {
        seen.set(v, `${r}-${c}`);
      }
    }
  };
  for (let r = 0; r < size; r++) markDupes(grid[r].map((v, c) => [r, c, v]));
  for (let c = 0; c < size; c++) markDupes(grid.map((row, r) => [r, c, row[c]]));
  if (boxDims) {
    const [boxH, boxW] = boxDims;
    for (let br = 0; br < size; br += boxH) {
      for (let bc = 0; bc < size; bc += boxW) {
        const box = [];
        for (let r = br; r < br + boxH; r++) {
          for (let c = bc; c < bc + boxW; c++) box.push([r, c, grid[r][c]]);
        }
        markDupes(box);
      }
    }
  }
  return conflicts;
}

// Rows/columns/boxes that are fully filled AND free of duplicates — positive
// feedback as sections come together, distinct from (and mutually exclusive
// with) the red conflict highlighting above.
function getCompletedUnits(grid, size, boxDims) {
  const rows = new Set();
  const cols = new Set();
  const boxes = new Set(); // keyed by "boxRow-boxCol" origin

  const isComplete = (cells) => !cells.some((v) => !v) && new Set(cells).size === size;

  for (let r = 0; r < size; r++) {
    if (isComplete(grid[r])) rows.add(r);
  }
  for (let c = 0; c < size; c++) {
    if (isComplete(grid.map((row) => row[c]))) cols.add(c);
  }
  if (boxDims) {
    const [boxH, boxW] = boxDims;
    for (let br = 0; br < size; br += boxH) {
      for (let bc = 0; bc < size; bc += boxW) {
        const box = [];
        for (let r = br; r < br + boxH; r++) {
          for (let c = bc; c < bc + boxW; c++) box.push(grid[r][c]);
        }
        if (isComplete(box)) boxes.add(`${br}-${bc}`);
      }
    }
  }
  return { rows, cols, boxes };
}

function isGridValid(grid, size, boxDims) {
  for (let r = 0; r < size; r++) {
    const row = grid[r];
    if (row.some((v) => !v)) return false;
    if (new Set(row).size !== size) return false;
  }
  for (let c = 0; c < size; c++) {
    const col = grid.map((row) => row[c]);
    if (new Set(col).size !== size) return false;
  }
  if (boxDims) {
    const [boxH, boxW] = boxDims;
    for (let br = 0; br < size; br += boxH) {
      for (let bc = 0; bc < size; bc += boxW) {
        const box = [];
        for (let r = br; r < br + boxH; r++) {
          for (let c = bc; c < bc + boxW; c++) box.push(grid[r][c]);
        }
        if (new Set(box).size !== size) return false;
      }
    }
  }
  return true;
}

export default function MiniSudoku() {
  const { user } = useAuth();
  const [phase, setPhase] = useState("picker"); // "picker" | "playing" | "result"
  const [pickedSize, setPickedSize] = useState(6);
  const [starting, setStarting] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [size, setSize] = useState(6);
  const [puzzle, setPuzzle] = useState(null);
  const [grid, setGrid] = useState(null);
  const [selected, setSelected] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const [myToday, setMyToday] = useState({ totalScore: 0, puzzlesPlayed: 0 });
  const [roster, setRoster] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [streak, setStreak] = useState(0);
  const tickRef = useRef(null);

  const boxDims = BOX_DIMS[size];

  const loadBoard = () => {
    setLoadingBoard(true);
    api
      .get("/game/sudoku/board")
      .then(({ data }) => {
        setMyToday(data.myToday);
        setRoster(data.roster);
        setStreak(data.streak || 0);
      })
      .catch(() => {})
      .finally(() => setLoadingBoard(false));
  };

  useEffect(() => {
    loadBoard();
  }, []);

  useEffect(() => {
    if (!startedAt || phase !== "playing") {
      clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => setElapsedMs(Date.now() - startedAt), 200);
    return () => clearInterval(tickRef.current);
  }, [startedAt, phase]);

  const startPuzzle = async () => {
    setStarting(true);
    try {
      const { data } = await api.post("/game/sudoku/start", { size: pickedSize });
      setSessionId(data.sessionId);
      setSize(data.size);
      setPuzzle(data.puzzle);
      setGrid(data.puzzle.map((row) => [...row]));
      setSelected(null);
      setStartedAt(null);
      setElapsedMs(0);
      setPhase("playing");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to start puzzle");
    } finally {
      setStarting(false);
    }
  };

  const isClue = (r, c) => puzzle && puzzle[r][c] !== 0;

  const selectCell = (r, c) => {
    if (isClue(r, c)) return;
    setSelected([r, c]);
  };

  const inputNumber = (n) => {
    if (!selected) return;
    if (!startedAt) setStartedAt(Date.now());
    const [r, c] = selected;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = n;
      return next;
    });
  };

  const clearCell = () => {
    if (!selected) return;
    const [r, c] = selected;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = 0;
      return next;
    });
  };

  const submit = async () => {
    if (submitting || !grid || !isGridValid(grid, size, boxDims)) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/game/sudoku/submit", {
        sessionId,
        grid,
        timeMs: Date.now() - startedAt,
      });
      setLastResult(data);
      setPhase("result");
      toast.success(`🎉 Solved! +${data.score} marks, +${data.pointsEarned} points`);
      if (data.newBadge) {
        setTimeout(() => toast.success("🏆 New badge: Sudoku Solver!", { duration: 4000 }), 400);
      }
      loadBoard();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const playAgain = () => {
    setLastResult(null);
    setPhase("picker");
  };

  const canSubmit = grid && isGridValid(grid, size, boxDims) && !submitting;
  const conflicts = grid ? getConflicts(grid, size, boxDims) : new Set();
  const completed = grid ? getCompletedUnits(grid, size, boxDims) : { rows: new Set(), cols: new Set(), boxes: new Set() };

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto text-slate-800 dark:text-white">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🧩</div>
        <h1 className="text-3xl font-bold mb-2">Mini Sudoku</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Play as many as you like — pick a size, solve it, earn marks. Ranked daily by total marks.
        </p>
        {myToday.puzzlesPlayed > 0 && (
          <p className="text-xs text-indigo-500 font-semibold mt-2">
            Today: {myToday.totalScore} marks across {myToday.puzzlesPlayed} puzzle{myToday.puzzlesPlayed === 1 ? "" : "s"}
          </p>
        )}
        {streak > 1 && (
          <p className="text-xs text-amber-500 font-semibold mt-1">🔥 {streak}-day streak</p>
        )}
      </div>

      <div className="glass-card p-6 space-y-4">
        {phase === "picker" && (
          <div className="text-center py-4 space-y-5">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Choose a size</p>
            <div className="flex justify-center gap-3">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setPickedSize(s)}
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold transition-colors ${
                    pickedSize === s
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
                  }`}
                >
                  <span className="text-lg">{s}×{s}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {s === 6 ? "quick" : s === 7 ? "medium" : "harder"}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={startPuzzle}
              disabled={starting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {starting ? "Starting…" : "Start Puzzle →"}
            </button>
          </div>
        )}

        {phase === "result" && lastResult && (
          <div className="text-center py-6 space-y-3">
            <div className="text-4xl">🎉</div>
            <p className="font-bold text-lg">Solved the {lastResult.size}×{lastResult.size}!</p>
            <div className="flex justify-center gap-6">
              <div>
                <p className="text-xs text-slate-400">Time</p>
                <p className="text-xl font-bold text-indigo-500">{(lastResult.timeMs / 1000).toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Marks earned</p>
                <p className="text-xl font-bold text-emerald-500">+{lastResult.score}</p>
              </div>
            </div>
            <button
              onClick={playAgain}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              ↻ Play Again
            </button>
          </div>
        )}

        {phase === "playing" && grid && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {size}×{size} — fill so every row{boxDims ? ", column and box" : " and column"} has no repeats
              </span>
              <span className="text-sm font-mono font-bold text-indigo-500">
                {(elapsedMs / 1000).toFixed(1)}s
              </span>
            </div>

            <div className="flex justify-center">
              <div
                className="grid border-2 border-slate-400 dark:border-slate-500 rounded-lg overflow-hidden"
                style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, width: "min(100%, 400px)" }}
              >
                {grid.map((row, r) =>
                  row.map((val, c) => {
                    const clue = isClue(r, c);
                    const isSelected = selected && selected[0] === r && selected[1] === c;
                    const hasConflict = conflicts.has(`${r}-${c}`);
                    const [boxH, boxW] = boxDims || [1, 1];
                    const boxKey = boxDims ? `${r - (r % boxH)}-${c - (c % boxW)}` : null;
                    const isCompleted =
                      completed.rows.has(r) || completed.cols.has(c) || (boxKey && completed.boxes.has(boxKey));
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => selectCell(r, c)}
                        disabled={clue}
                        title={hasConflict ? "Conflicts with another cell in this row/column/box" : undefined}
                        className={`aspect-square flex items-center justify-center text-base font-mono font-bold transition-colors
                          ${boxDims && c % boxW === 0 && c !== 0 ? "border-l-2 border-l-slate-400 dark:border-l-slate-500" : "border-l border-l-slate-200 dark:border-l-slate-700"}
                          ${boxDims && r % boxH === 0 && r !== 0 ? "border-t-2 border-t-slate-400 dark:border-t-slate-500" : "border-t border-t-slate-200 dark:border-t-slate-700"}
                          ${hasConflict
                            ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 ring-2 ring-inset ring-red-400"
                            : isSelected
                              ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                              : isCompleted
                                ? clue
                                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-slate-700 dark:text-slate-200 cursor-default"
                                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : clue
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-default"
                                  : "bg-white dark:bg-slate-900 text-indigo-500 dark:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                      >
                        {val || ""}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: size }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => inputNumber(n)}
                  disabled={!selected}
                  className="w-10 h-10 rounded-xl text-base font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={clearCell}
                disabled={!selected}
                className="w-10 h-10 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/10 text-slate-400 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setPhase("picker")}
                className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
              >
                ← Abandon &amp; pick another size
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  canSubmit
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed"
                }`}
              >
                {submitting ? "Submitting…" : "Submit ✓"}
              </button>
            </div>
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
                {r.status === "ranked" ? (
                  <span className="w-full sm:w-auto pl-9 sm:pl-0 flex items-center gap-3">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{r.puzzlesPlayed} solved</span>
                    <span className="text-sm font-bold text-indigo-500 whitespace-nowrap">{r.totalScore} marks</span>
                  </span>
                ) : (
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
