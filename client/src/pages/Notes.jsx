import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import RichTextEditor, { isRichTextEmpty } from "../components/RichTextEditor";
import { unlockWithPassphrase, createVerificationBlob, encryptText, decryptText } from "../utils/noteCrypto";

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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
  const [phase, setPhase] = useState("loading"); // loading | setup | unlock | ready
  const [salt, setSalt] = useState(null);
  const [verifyCipher, setVerifyCipher] = useState(null);
  const [verifyIv, setVerifyIv] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const keyRef = useRef(null); // CryptoKey — in memory only, never persisted

  const [notes, setNotes] = useState([]); // decrypted: [{id, title, body, createdAt, updatedAt}]
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [editing, setEditing] = useState(null); // null | "new" | note object
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [saving, setSaving] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    api.get("/notes/salt").then(({ data }) => {
      setSalt(data.salt);
      setVerifyCipher(data.verifyCipher);
      setVerifyIv(data.verifyIv);
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
      const key = await unlockWithPassphrase(passphrase, salt, null, null);
      const { cipher, iv } = await createVerificationBlob(key);
      await api.post("/notes/verify-setup", { cipher, iv });
      keyRef.current = key;
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
      const key = await unlockWithPassphrase(passphrase, salt, verifyCipher, verifyIv);
      keyRef.current = key;
      setPhase("ready");
      await loadNotes(key);
    } catch {
      setUnlockError("Wrong passphrase — try again.");
    } finally {
      setUnlocking(false);
    }
  }

  function openNew() {
    setEditing("new");
    setEditTitle("");
    setEditBody("");
  }

  function openEdit(note) {
    setEditing(note);
    setEditTitle(note.title);
    setEditBody(note.body);
  }

  async function saveNote() {
    if (!editTitle.trim() && isRichTextEmpty(editBody)) {
      toast.error("Note is empty");
      return;
    }
    setSaving(true);
    try {
      const key = keyRef.current;
      const titleEnc = await encryptText(key, editTitle.trim() || "Untitled");
      const bodyEnc = await encryptText(key, editBody);
      const payload = {
        titleCipher: titleEnc.cipher, titleIv: titleEnc.iv,
        bodyCipher: bodyEnc.cipher, bodyIv: bodyEnc.iv,
      };
      if (editing === "new") {
        const { data } = await api.post("/notes", payload);
        setNotes((prev) => [{ id: data.id, title: editTitle.trim() || "Untitled", body: editBody, createdAt: data.createdAt, updatedAt: data.updatedAt }, ...prev]);
      } else {
        const { data } = await api.patch(`/notes/${editing.id}`, payload);
        setNotes((prev) => prev.map((n) => (n.id === editing.id ? { ...n, title: editTitle.trim() || "Untitled", body: editBody, updatedAt: data.updatedAt } : n)));
      }
      setEditing(null);
      toast.success("Saved");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(id) {
    if (!window.confirm("Delete this note? This can't be undone.")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editing?.id === id) setEditing(null);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
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
          <button
            onClick={phase === "setup" ? handleSetup : handleUnlock}
            disabled={unlocking || !passphrase}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all"
          >
            {unlocking ? "Working…" : phase === "setup" ? "Create & Unlock" : "🔓 Unlock"}
          </button>
        </motion.div>
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
        <div className="flex gap-2">
          <button onClick={() => setExportOpen(true)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors">
            ⬇ Export CSV
          </button>
          <button onClick={openNew} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
            + New Note
          </button>
        </div>
      </div>

      {loadingNotes ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card h-40 animate-pulse" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-2">🗒️</p>
          <p>No notes yet — click "+ New Note" to write your first one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notes.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => openEdit(n)}
              className="glass-card p-4 h-40 flex flex-col cursor-pointer hover:ring-2 hover:ring-indigo-500/40 transition-all"
            >
              <h3 className="font-semibold truncate mb-1">{n.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex-1 overflow-hidden">{stripHtml(n.body).slice(0, 160)}</p>
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
              <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full text-lg font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
    </div>
  );
}
