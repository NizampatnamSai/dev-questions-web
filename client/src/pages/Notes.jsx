import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import RichTextEditor, { isRichTextEmpty } from "../components/RichTextEditor";
import Select from "../components/Select";
import Checkbox from "../components/Checkbox";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";
import {
  unlockWithPassphrase, createVerificationBlob, encryptText, decryptText,
  rememberKeyForSession, restoreKeyForSession, forgetSessionKey,
} from "../utils/noteCrypto";

function stripHtml(html) {
  if (!html) return "";
  // Let the browser's own HTML parser do this — a regex can strip tags but
  // can't reliably decode every entity Quill can produce (&nbsp;, &amp;,
  // &lt;, numeric entities, etc.). Using a real (detached, never-rendered)
  // element guarantees this matches whatever the browser considers valid HTML.
  const el = document.createElement("div");
  el.innerHTML = html;
  return (el.textContent || "").replace(/\s+/g, " ").trim();
}

function textToHtml(text) {
  return text
    .split(/\n\n+/)
    .map((para) => `<p>${para.trim().replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const RANGE_PRESETS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
  { id: "custom", label: "Custom" },
];

function rangeToDates(preset, customStart, customEnd) {
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (preset === "today") return [startOfDay(now), new Date()];
  if (preset === "week") {
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday-start week
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    return [startOfDay(start), new Date()];
  }
  if (preset === "month") return [new Date(now.getFullYear(), now.getMonth(), 1), new Date()];
  if (preset === "year") return [new Date(now.getFullYear(), 0, 1), new Date()];
  if (preset === "custom" && customStart && customEnd) {
    return [new Date(customStart), new Date(new Date(customEnd).getTime() + 24 * 60 * 60 * 1000 - 1)];
  }
  return [null, null];
}

export default function Notes() {
  const { confirm, confirmProps } = useConfirm();
  const [phase, setPhase] = useState("loading"); // loading | setup | unlock | ready
  const [salt, setSalt] = useState(null);
  const [verifyCipher, setVerifyCipher] = useState(null);
  const [verifyIv, setVerifyIv] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showRememberConfirm, setShowRememberConfirm] = useState(false);
  const [sessionRemembered, setSessionRemembered] = useState(false); // true once this tab is relying on a cached key
  // Blur note cards for over-the-shoulder privacy — "off" | "all" | "title" | "description".
  // Hovering a card reveals it; the preference persists per-browser.
  const [blurMode, setBlurMode] = useState(() => {
    try { return localStorage.getItem("devquiz_notes_blur") || "off"; } catch { return "off"; }
  });
  useEffect(() => {
    try { localStorage.setItem("devquiz_notes_blur", blurMode); } catch {}
  }, [blurMode]);
  const keyRef = useRef(null); // CryptoKey — in memory only unless "remember" is opted into

  const [notes, setNotes] = useState([]); // decrypted: [{id, title, body, createdAt, updatedAt}]
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Advanced search — entirely client-side, since notes are end-to-end
  // encrypted and the server never sees plaintext to search against. All
  // filtering runs against the already-decrypted `notes` state in memory.
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchRange, setSearchRange] = useState("all");
  const [searchCustomStart, setSearchCustomStart] = useState("");
  const [searchCustomEnd, setSearchCustomEnd] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | title

  const filteredNotes = useMemo(() => {
    let result = notes;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || stripHtml(n.body).toLowerCase().includes(q),
      );
    }
    if (searchRange !== "all") {
      const [start, end] = rangeToDates(searchRange, searchCustomStart, searchCustomEnd);
      if (start && end) {
        result = result.filter((n) => {
          const d = new Date(n.updatedAt || n.createdAt);
          return d >= start && d <= end;
        });
      }
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      const da = new Date(a.updatedAt || a.createdAt);
      const db = new Date(b.updatedAt || b.createdAt);
      return sortBy === "oldest" ? da - db : db - da;
    });
    return result;
  }, [notes, searchQuery, searchRange, searchCustomStart, searchCustomEnd, sortBy]);

  const hasActiveSearch = searchQuery.trim() !== "" || searchRange !== "all";
  const [editing, setEditing] = useState(null); // null | "new" | note object
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [saving, setSaving] = useState(false);
  // "idle" (nothing typed yet) | "dirty" (unsaved changes, debounce pending)
  // | "saving" | "saved". Drives the yellow "Draft" border/label so an
  // interrupted session (lost network, closed the laptop, switched screens)
  // doesn't lose typed content — auto-save fires ~1.5s after typing stops,
  // and immediately (bypassing the debounce) when the tab is hidden.
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
  const autoSaveTimerRef = useRef(null);
  const editingRef = useRef(editing);
  const editTitleRef = useRef(editTitle);
  const editBodyRef = useRef(editBody);
  // openNew()/openEdit() set editing+editTitle+editBody together in one
  // handler, so they land in the same React batch — this flag lets the
  // debounce effect below tell "editor just opened with initial content"
  // apart from "user actually typed something," so opening an existing note
  // doesn't immediately mark it dirty and schedule a pointless autosave.
  const justOpenedRef = useRef(false);
  const [showAiWrite, setShowAiWrite] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiWriting, setAiWriting] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    api.get("/notes/salt").then(async ({ data }) => {
      setSalt(data.salt);
      setVerifyCipher(data.verifyCipher);
      setVerifyIv(data.verifyIv);
      // If the user opted in to "remember this session" earlier, this tab may
      // already have a usable key cached — skip the passphrase prompt entirely.
      const remembered = await restoreKeyForSession(data.salt, data.verifyCipher, data.verifyIv);
      if (remembered) {
        keyRef.current = remembered;
        setSessionRemembered(true);
        setPhase("ready");
        await loadNotes(remembered);
        return;
      }
      setPhase(data.verifyCipher ? "unlock" : "setup");
    }).catch(() => toast.error("Failed to load notes setup"));
  }, []);

  async function loadNotes(key) {
    setLoadingNotes(true);
    try {
      const { data } = await api.get("/notes");
      const decrypted = await Promise.all(data.map(async (n) => {
        try {
          const title = await decryptText(key, n.titleCipher, n.titleIv);
          const body = await decryptText(key, n.bodyCipher, n.bodyIv);
          return { id: n.id, title, body, createdAt: n.createdAt, updatedAt: n.updatedAt };
        } catch {
          return { id: n.id, title: "⚠️ Could not decrypt", body: "", createdAt: n.createdAt, updatedAt: n.updatedAt, error: true };
        }
      }));
      setNotes(decrypted);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoadingNotes(false);
    }
  }

  async function handleSetup() {
    if (passphrase.length < 8) {
      toast.error("Use at least 8 characters — this can't be recovered if forgotten");
      return;
    }
    if (passphrase !== confirmPassphrase) {
      toast.error("Passphrases don't match");
      return;
    }
    setUnlocking(true);
    try {
      const key = await unlockWithPassphrase(passphrase, salt, null, null, rememberMe);
      const { cipher, iv } = await createVerificationBlob(key);
      await api.post("/notes/verify-setup", { cipher, iv });
      keyRef.current = key;
      if (rememberMe) {
        await rememberKeyForSession(key, salt);
        setSessionRemembered(true);
      }
      setPhase("ready");
      await loadNotes(key);
      toast.success("Notes unlocked — keep your passphrase safe, it can't be reset!");
    } catch {
      toast.error("Setup failed — try again");
    } finally {
      setUnlocking(false);
    }
  }

  async function handleUnlock() {
    setUnlockError("");
    setUnlocking(true);
    try {
      const key = await unlockWithPassphrase(passphrase, salt, verifyCipher, verifyIv, rememberMe);
      keyRef.current = key;
      if (rememberMe) {
        await rememberKeyForSession(key, salt);
        setSessionRemembered(true);
      }
      setPhase("ready");
      await loadNotes(key);
    } catch {
      setUnlockError("Wrong passphrase — try again.");
    } finally {
      setUnlocking(false);
    }
  }

  function onToggleRemember(checked) {
    if (checked) setShowRememberConfirm(true);
    else setRememberMe(false);
  }

  function handleForgetSession() {
    forgetSessionKey();
    setSessionRemembered(false);
    setRememberMe(false);
    keyRef.current = null;
    setNotes([]);
    setPassphrase("");
    setPhase(verifyCipher ? "unlock" : "setup");
    toast.success("Locked — you'll be asked for your passphrase again.");
  }

  // Keep refs in sync so the debounce timer / visibilitychange handler below
  // (both created once, outside React's render cycle) always read fresh
  // values instead of whatever was current when they were set up.
  useEffect(() => { editingRef.current = editing; }, [editing]);
  useEffect(() => { editTitleRef.current = editTitle; }, [editTitle]);
  useEffect(() => { editBodyRef.current = editBody; }, [editBody]);

  // Marks the next title/body change-effect run as "just opened" so
  // populating the modal with an existing note's content doesn't itself
  // count as an edit.
  useEffect(() => {
    if (editing) {
      justOpenedRef.current = true;
      setAutoSaveStatus("idle");
    }
  }, [editing]);

  // Debounced auto-save — fires ~1.5s after the user stops typing.
  useEffect(() => {
    if (!editing) return;
    if (justOpenedRef.current) {
      justOpenedRef.current = false;
      return;
    }
    if (!editTitle.trim() && isRichTextEmpty(editBody)) {
      setAutoSaveStatus("idle");
      return;
    }
    setAutoSaveStatus("dirty");
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(autoSaveNote, 1500);
    return () => clearTimeout(autoSaveTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTitle, editBody]);

  // Covers "switched to another tab/app" and most OS sleep/lid-close paths
  // (they fire visibilitychange before actually suspending) — saves
  // immediately instead of waiting out the debounce.
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "hidden" && editingRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveNote();
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  function openNew() {
    setEditing("new");
    setEditTitle("");
    setEditBody("");
    setShowAiWrite(false);
    setAiPrompt("");
  }

  function openEdit(note) {
    setEditing(note);
    setEditTitle(note.title);
    setEditBody(note.body);
    setShowAiWrite(false);
    setAiPrompt("");
  }

  async function generateWithAi() {
    if (!aiPrompt.trim()) return;
    setAiWriting(true);
    try {
      const { data } = await api.post("/ai/ask", {
        question: `Write note content for this request, as plain prose (no markdown headers, no code fences unless code is actually requested): "${aiPrompt.trim()}"`,
      });
      setEditBody((prev) => (isRichTextEmpty(prev) ? "" : prev) + textToHtml(data.answer));
      setAiPrompt("");
      setShowAiWrite(false);
      toast.success("Added to note — feel free to edit it");
    } catch (err) {
      toast.error(err.response?.data?.detail || "AI couldn't write that — try again");
    } finally {
      setAiWriting(false);
    }
  }

  // Shared by the manual Save button and auto-save — encrypts + POSTs/PATCHes
  // and returns the resulting note. Reads from refs (not the title/body
  // state directly) so it stays correct when called from the debounce timer
  // or the visibilitychange handler, where the closure would otherwise be
  // holding stale values from whenever the timer/listener was created.
  async function persistNote(title, body) {
    const key = keyRef.current;
    const titleEnc = await encryptText(key, title.trim() || "Untitled");
    const bodyEnc = await encryptText(key, body);
    const payload = {
      titleCipher: titleEnc.cipher, titleIv: titleEnc.iv,
      bodyCipher: bodyEnc.cipher, bodyIv: bodyEnc.iv,
    };
    if (editingRef.current === "new") {
      const { data } = await api.post("/notes", payload);
      const created = { id: data.id, title: title.trim() || "Untitled", body, createdAt: data.createdAt, updatedAt: data.updatedAt };
      setNotes((prev) => [created, ...prev]);
      return created;
    }
    const noteId = editingRef.current.id;
    const { data } = await api.patch(`/notes/${noteId}`, payload);
    const updated = { ...editingRef.current, title: title.trim() || "Untitled", body, updatedAt: data.updatedAt };
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    return updated;
  }

  async function saveNote() {
    if (!editTitle.trim() && isRichTextEmpty(editBody)) {
      toast.error("Note is empty");
      return;
    }
    setSaving(true);
    clearTimeout(autoSaveTimerRef.current);
    try {
      await persistNote(editTitle, editBody);
      setEditing(null);
      setAutoSaveStatus("idle");
      toast.success("Saved");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  // Silent counterpart — no toast, doesn't close the editor. A "new" note's
  // first auto-save switches editingRef to the real created note so the
  // NEXT auto-save PATCHes it instead of creating a duplicate.
  async function autoSaveNote() {
    const title = editTitleRef.current;
    const body = editBodyRef.current;
    if (!title.trim() && isRichTextEmpty(body)) return;
    setAutoSaveStatus("saving");
    try {
      const result = await persistNote(title, body);
      if (editingRef.current === "new") setEditing(result);
      setAutoSaveStatus("saved");
    } catch {
      setAutoSaveStatus("dirty"); // will retry on the next keystroke or tab-hide
    }
  }

  function deleteNote(id) {
    confirm({
      title: "Delete this note?",
      message: "This can't be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await api.delete(`/notes/${id}`);
          setNotes((prev) => prev.filter((n) => n.id !== id));
          if (editing?.id === id) setEditing(null);
          toast.success("Deleted");
        } catch {
          toast.error("Failed to delete");
        }
      },
    });
  }

  function exportCsv() {
    const [start, end] = rangeToDates(exportPreset, customStart, customEnd);
    if (!start || !end) {
      toast.error("Pick a valid custom range");
      return;
    }
    const inRange = notes.filter((n) => {
      const d = new Date(n.createdAt);
      return d >= start && d <= end;
    });
    if (!inRange.length) {
      toast.error("No notes in that range");
      return;
    }
    const rows = [["Date", "Title", "Content"], ...inRange.map((n) => [
      new Date(n.createdAt).toLocaleString(), n.title, stripHtml(n.body),
    ])];
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `notes-${exportPreset}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setExportOpen(false);
    toast.success(`Exported ${inRange.length} note(s)`);
  }

  if (phase === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  }

  if (phase === "setup" || phase === "unlock") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 max-w-md w-full space-y-4 text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            {phase === "setup" ? "Create your Notes passphrase" : "Enter your Notes passphrase"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {phase === "setup"
              ? "This encrypts your notes end-to-end — even we can't read them. It's separate from your account password and never leaves your device. There is no reset if you forget it."
              : "Your notes are encrypted with this passphrase and decrypted only in your browser."}
          </p>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (phase === "setup" ? handleSetup() : handleUnlock())}
            placeholder="Passphrase"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {phase === "setup" && (
            <input
              type="password"
              value={confirmPassphrase}
              onChange={(e) => setConfirmPassphrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetup()}
              placeholder="Confirm passphrase"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
          {unlockError && <p className="text-sm text-red-500">{unlockError}</p>}
          <div className="flex justify-center">
            <Checkbox
              checked={rememberMe}
              onChange={onToggleRemember}
              label="Don't ask again this session"
              className="text-slate-500 dark:text-slate-400"
            />
          </div>
          <button
            onClick={phase === "setup" ? handleSetup : handleUnlock}
            disabled={unlocking || !passphrase}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all"
          >
            {unlocking ? "Working…" : phase === "setup" ? "Create & Unlock" : "🔓 Unlock"}
          </button>
        </motion.div>

        <AnimatePresence>
          {showRememberConfirm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
              onClick={() => setShowRememberConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 max-w-sm w-full space-y-4 text-center"
              >
                <div className="text-4xl">⚠️</div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Skip the passphrase this session?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your notes will stay unlocked on this browser tab until you log out or close the browser —
                  anyone who uses this device or browser during that time could open them without your passphrase.
                  You'll be asked again after logout, or on any other browser or device.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRememberConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setRememberMe(true); setShowRememberConfirm(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
                  >
                    Yes, remember
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto text-slate-800 dark:text-white">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">📝 Notes</h1>
          <p className="text-xs text-slate-400 mt-0.5">🔒 End-to-end encrypted — only you can read these</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            value={blurMode}
            onChange={setBlurMode}
            className="w-auto min-w-[9rem]"
            options={[
              { value: "off", label: "👁 Blur: Off" },
              { value: "all", label: "🙈 Blur: All" },
              { value: "title", label: "🙈 Blur: Title" },
              { value: "description", label: "🙈 Blur: Description" },
            ]}
          />
          {sessionRemembered && (
            <button
              onClick={handleForgetSession}
              title="Stop skipping the passphrase prompt on this tab"
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              🔒 Ask for passphrase again
            </button>
          )}
          <button onClick={() => setExportOpen(true)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors whitespace-nowrap">
            ⬇ Export CSV
          </button>
          <button onClick={openNew} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap">
            + New Note
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex gap-2 flex-wrap items-center">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search notes by title or content…"
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
                showAdvanced || searchRange !== "all" || sortBy !== "newest"
                  ? "bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300"
                  : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              ⚙️ Advanced {showAdvanced ? "▲" : "▼"}
            </button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-4 flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Date range</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {[{ id: "all", label: "All time" }, ...RANGE_PRESETS].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSearchRange(r.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                            searchRange === r.id
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                    {searchRange === "custom" && (
                      <div className="flex gap-2 mt-2">
                        <input type="date" value={searchCustomStart} onChange={(e) => setSearchCustomStart(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm" />
                        <input type="date" value={searchCustomEnd} onChange={(e) => setSearchCustomEnd(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Sort by</label>
                    <div className="flex gap-1.5">
                      {[
                        { id: "newest", label: "Newest first" },
                        { id: "oldest", label: "Oldest first" },
                        { id: "title", label: "Title A-Z" },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSortBy(s.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                            sortBy === s.id
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasActiveSearch && (
                    <button
                      onClick={() => { setSearchQuery(""); setSearchRange("all"); setSortBy("newest"); }}
                      className="text-xs px-3 py-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {hasActiveSearch && (
            <p className="text-xs text-slate-400">
              Showing <strong className="text-slate-600 dark:text-slate-300">{filteredNotes.length}</strong> of {notes.length} note{notes.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}

      {loadingNotes ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card h-40 animate-pulse" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-2">🗒️</p>
          <p>No notes yet — click "+ New Note" to write your first one.</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-2">🔍</p>
          <p>No notes match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNotes.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => openEdit(n)}
              className="group glass-card p-4 h-40 flex flex-col cursor-pointer hover:ring-2 hover:ring-indigo-500/40 transition-all"
            >
              <h3
                className={`font-semibold truncate mb-1 transition-[filter] duration-150 ${
                  (blurMode === "all" || blurMode === "title") ? "blur-sm group-hover:blur-none" : ""
                }`}
              >
                {n.title}
              </h3>
              <p
                className={`text-xs text-slate-500 dark:text-slate-400 flex-1 overflow-hidden transition-[filter] duration-150 ${
                  (blurMode === "all" || blurMode === "description") ? "blur-sm group-hover:blur-none" : ""
                }`}
              >
                {stripHtml(n.body).slice(0, 160)}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/10">
                <span className="text-[10px] text-slate-400">{new Date(n.updatedAt).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} className="text-xs text-red-400 hover:text-red-500">
                  🗑
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className={`glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 border-2 transition-colors ${
                  autoSaveStatus === "dirty" || autoSaveStatus === "saving"
                    ? "border-amber-400 dark:border-amber-500/60"
                    : "border-transparent"
                }`}
              >
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full text-lg font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-between">
                  {autoSaveStatus === "dirty" && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      ● Draft — unsaved changes
                    </span>
                  )}
                  {autoSaveStatus === "saving" && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                      Saving draft…
                    </span>
                  )}
                  {autoSaveStatus === "saved" && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Draft saved</span>
                  )}
                  {autoSaveStatus === "idle" && <span />}
                  <button
                    onClick={() => setShowAiWrite((v) => !v)}
                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 font-semibold transition-colors"
                  >
                    ✨ AI Write
                  </button>
                </div>
                {showAiWrite && (
                  <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 p-3 space-y-2">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), generateWithAi())}
                      placeholder="What should I write? e.g. 'a packing checklist for a weekend trip'"
                      rows={2}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] text-slate-400">
                        Unlike the rest of Notes, this prompt is sent to the AI to generate a response — it isn't end-to-end encrypted like your saved notes.
                      </p>
                      <button
                        onClick={generateWithAi}
                        disabled={!aiPrompt.trim() || aiWriting}
                        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold transition-colors"
                      >
                        {aiWriting ? "Writing…" : "Generate"}
                      </button>
                    </div>
                  </div>
                )}
                <RichTextEditor value={editBody} onChange={setEditBody} placeholder="Write your note…" />
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(null)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveNote} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors">
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export modal */}
      <AnimatePresence>
        {exportOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExportOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-sm p-6 space-y-4">
                <h2 className="text-lg font-bold">⬇ Export Notes to CSV</h2>
                <div className="flex flex-wrap gap-2">
                  {RANGE_PRESETS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setExportPreset(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${exportPreset === r.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {exportPreset === "custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm" />
                    <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm" />
                  </div>
                )}
                <button onClick={exportCsv} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-white transition-all">
                  Download CSV
                </button>
                <p className="text-[11px] text-slate-400">Decrypted and generated entirely in your browser — nothing is sent to the server.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
