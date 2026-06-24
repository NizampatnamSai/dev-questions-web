import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import AnswerBlock from "../components/AnswerBlock";
import { fmtDate, fmtTime } from "../utils/time";
import ConfirmModal from "../components/ConfirmModal";

function DraftCard({ q, onPublish, onDelete, onUpdate, publishing, communityToday }) {
  const [revealed, setRevealed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ question: q.question, answer: q.answer, hints: q.hints || [], tags: q.tags || [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ question: q.question, answer: q.answer, hints: q.hints || [], tags: q.tags || [] });
  }, [q.question, q.answer, q.tags]);

  const saveEdit = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/questions/${q.id}`, form);
      toast.success("Draft updated");
      setEditing(false);
      onUpdate?.({ ...q, ...form, ...(data || {}) });
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass-card p-5 space-y-3"
    >
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] px-2 py-0.5 rounded-full border font-medium bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
          💾 Draft
        </span>
        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
          q.level === "High" ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30"
          : q.level === "Medium" ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
          : "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30"
        }`}>
          {q.level}
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full border font-medium bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30">
          {q.type === "Coding" ? "💻 Coding" : "🧩 Technical"}
        </span>
        <span className="ml-auto text-[10px] text-slate-400">
          {fmtDate(q.createdAt)} {fmtTime(q.createdAt)}
        </span>
      </div>

      {/* Question / edit */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            rows={3}
            className="input-light text-sm resize-none w-full"
            placeholder="Question"
          />
          <textarea
            value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            rows={5}
            className="input-light text-sm font-mono resize-none w-full"
            placeholder="Answer"
          />
          <input
            value={form.tags.join(", ")}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
            className="input-light text-sm w-full"
            placeholder="Tags (comma separated)"
          />
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              disabled={saving}
              className="text-xs px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setEditing(false); setForm({ question: q.question, answer: q.answer, hints: q.hints || [], tags: q.tags || [] }); }}
              className="text-xs px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="font-semibold text-slate-800 dark:text-slate-100 leading-snug">{q.question}</p>
          <button
            onClick={() => setRevealed(r => !r)}
            className="text-xs text-indigo-600 dark:text-cyan-300 font-medium hover:underline self-start"
          >
            {revealed ? "Hide answer ▲" : "Preview answer ▼"}
          </button>
          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                  <AnswerBlock text={q.answer} questionType={q.type} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {q.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {q.tags.map((t, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10">#{t}</span>
              ))}
            </div>
          )}
        </>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10 flex-wrap">
        <button
          onClick={() => setEditing(e => !e)}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(q)}
          className="text-xs px-3 py-1.5 rounded-full border border-red-300/40 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          🗑 Delete
        </button>
        {(() => {
          const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
          const isBlocked = !!(communityToday?.allowed && communityToday?.allowedEmail && communityToday?.myDay !== todayName);
          const postMsg = isBlocked
            ? `Today is ${communityToday.allowedName}'s posting day.${communityToday.myDay ? ` You can post on ${communityToday.myDay}.` : " You're not scheduled this week."}`
            : "";
          return (
            <div className="ml-auto relative group">
              <button
                onClick={() => {
                  if (isBlocked) { toast(postMsg, { icon: "📅", duration: 4000 }); return; }
                  onPublish(q);
                }}
                disabled={publishing === q.id}
                className={`text-xs px-4 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-colors ${
                  isBlocked
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-900 disabled:opacity-60"
                }`}
              >
                {publishing === q.id
                  ? <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Publishing…</>
                  : "📤 Post to Community"}
              </button>
              {isBlocked && (
                <div className="absolute bottom-full right-0 mb-2 w-60 px-3 py-2 bg-slate-800 text-white text-[11px] rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-snug">
                  {postMsg}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
}

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [communityToday, setCommunityToday] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: draftsData }, { data: todayData }] = await Promise.all([
        api.get("/questions/mine/drafts"),
        api.get("/questions/community-today"),
      ]);
      setDrafts(draftsData);
      setCommunityToday(todayData);
    } catch {
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handlePublish = async (q) => {
    setPublishing(q.id);
    try {
      await api.patch(`/questions/${q.id}/publish`);
      setDrafts(ds => ds.filter(d => d.id !== q.id));
      toast.success("Posted to community! 🎉");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to publish";
      toast.error(msg, { duration: 5000 });
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/questions/${deleteTarget.id}`);
      setDrafts(ds => ds.filter(d => d.id !== deleteTarget.id));
      toast.success("Draft deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">💾 My Drafts</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Questions saved as drafts — edit and post whenever your schedule allows.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3">💾</div>
          <p className="font-medium text-slate-600 dark:text-slate-300">No drafts yet</p>
          <p className="text-sm mt-1">Use "Save Draft" in the AI Generator to save questions for later.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400">{drafts.length} draft{drafts.length !== 1 ? "s" : ""} saved</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {drafts.map(q => (
                <DraftCard
                  key={q.id}
                  q={q}
                  onPublish={handlePublish}
                  onDelete={q => setDeleteTarget(q)}
                  onUpdate={updated => setDrafts(ds => ds.map(d => d.id === updated.id ? updated : d))}
                  publishing={publishing}
                  communityToday={communityToday}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete draft?"
        message="This draft will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
