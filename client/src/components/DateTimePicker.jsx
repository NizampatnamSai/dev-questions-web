import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../hooks/useClickOutside";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad2 = (n) => String(n).padStart(2, "0");

// datetime-local's value format is a local-naive "YYYY-MM-DDTHH:mm" — no
// timezone conversion here, same convention the native input this replaces
// already used (the parent's `min`/ISO-conversion logic keeps working as-is).
function toValue(date) {
  if (!date) return "";
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function fromValue(value) {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, min] = (timePart || "00:00").split(":").map(Number);
  const dt = new Date(y, m - 1, d, h, min);
  return isNaN(dt) ? null : dt;
}

function formatDisplay(date) {
  if (!date) return "";
  const hour12 = ((date.getHours() + 11) % 12) + 1;
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}, ${pad2(hour12)}:${pad2(date.getMinutes())} ${ampm}`;
}

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Custom popover date+time picker with an explicit Cancel/OK footer —
// replaces the native <input type="datetime-local">, whose browser-rendered
// picker can't have a confirm button and only loosely enforces `min` (blocks
// past calendar days but not past times on today), so past-time selections
// went unnoticed until a much-later form submit.
export default function DateTimePicker({ value, onChange, min, className = "", placeholder = "Pick a date & time" }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => fromValue(value));
  const [viewDate, setViewDate] = useState(() => fromValue(value) || new Date());
  const [error, setError] = useState("");
  const ref = useRef(null);

  const minDate = fromValue(min);

  useEffect(() => {
    if (open) {
      const initial = fromValue(value) || null;
      setDraft(initial);
      setViewDate(initial || (minDate && minDate > new Date() ? minDate : new Date()));
      setError("");
    }
  }, [open]);

  useClickOutside(ref, () => setOpen(false), open);

  const commit = () => {
    if (!draft) { setError("Pick a date and time first."); return; }
    if (minDate && draft < minDate) { setError("That time has already passed — pick a time in the future."); return; }
    onChange(toValue(draft));
    setOpen(false);
  };

  const clear = () => {
    onChange("");
    setDraft(null);
    setOpen(false);
  };

  const pickDay = (day) => {
    setError("");
    setDraft((prev) => {
      const base = prev || new Date(day.getFullYear(), day.getMonth(), day.getDate(), new Date().getHours(), new Date().getMinutes());
      const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), base.getHours(), base.getMinutes());
      return next;
    });
    if (day.getMonth() !== viewDate.getMonth() || day.getFullYear() !== viewDate.getFullYear()) {
      setViewDate(day);
    }
  };

  const setHour12 = (h12) => {
    setError("");
    setDraft((prev) => {
      const base = prev || new Date();
      const isPM = base.getHours() >= 12;
      const h24 = (h12 % 12) + (isPM ? 12 : 0);
      const next = new Date(base);
      next.setHours(h24);
      return next;
    });
  };

  const setMinute = (m) => {
    setError("");
    setDraft((prev) => {
      const base = prev || new Date();
      const next = new Date(base);
      next.setMinutes(m);
      return next;
    });
  };

  const setAmPm = (pm) => {
    setError("");
    setDraft((prev) => {
      const base = prev || new Date();
      const h = base.getHours() % 12;
      const next = new Date(base);
      next.setHours(pm ? h + 12 : h);
      return next;
    });
  };

  const goToday = () => {
    setError("");
    const now = new Date();
    setViewDate(now);
    setDraft((prev) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), prev?.getHours() ?? now.getHours(), prev?.getMinutes() ?? now.getMinutes()));
  };

  // 6x7 grid including leading/trailing days from adjacent months.
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const minDay = minDate ? startOfDay(minDate) : null;
  const current = fromValue(value);
  const hour12 = draft ? ((draft.getHours() + 11) % 12) + 1 : "";
  const isPM = draft ? draft.getHours() >= 12 : false;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${className} flex items-center justify-between gap-2 text-left`}
      >
        <span className={current ? "" : "text-slate-400"}>
          {current ? formatDisplay(current) : placeholder}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          {current && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Clear"
            >
              ✕
            </span>
          )}
          📅
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1.5 w-[300px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl p-3"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ‹
              </button>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ›
              </button>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {WEEKDAYS.map((w, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-slate-400 py-1">{w}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5 mb-3">
              {days.map((d, i) => {
                const inMonth = d.getMonth() === viewDate.getMonth();
                const disabled = minDay && startOfDay(d) < minDay;
                const selected = sameDay(d, draft);
                const isToday = sameDay(d, new Date());
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => pickDay(d)}
                    className={`h-8 rounded-lg text-xs font-medium transition-colors ${
                      selected
                        ? "bg-indigo-600 text-white"
                        : disabled
                          ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                          : !inMonth
                            ? "text-slate-350 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            : isToday
                              ? "border border-indigo-400 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Time selectors */}
            <div className="flex items-center gap-1.5 mb-3">
              <select
                value={hour12}
                onChange={(e) => setHour12(Number(e.target.value))}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 py-1.5 px-1 text-center"
              >
                {!draft && <option value="">--</option>}
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>{pad2(h)}</option>
                ))}
              </select>
              <span className="text-slate-400 font-bold">:</span>
              <select
                value={draft ? draft.getMinutes() : ""}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 py-1.5 px-1 text-center"
              >
                {!draft && <option value="">--</option>}
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>{pad2(m)}</option>
                ))}
              </select>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden flex-shrink-0">
                <button
                  type="button"
                  disabled={!draft}
                  onClick={() => setAmPm(false)}
                  className={`px-2 py-1.5 text-xs font-semibold ${!isPM && draft ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300"}`}
                >
                  AM
                </button>
                <button
                  type="button"
                  disabled={!draft}
                  onClick={() => setAmPm(true)}
                  className={`px-2 py-1.5 text-xs font-semibold ${isPM && draft ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300"}`}
                >
                  PM
                </button>
              </div>
            </div>

            {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex gap-3">
                <button type="button" onClick={clear} className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  Clear
                </button>
                <button type="button" onClick={goToday} className="text-xs font-medium text-indigo-500 hover:text-indigo-600">
                  Today
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={commit}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
