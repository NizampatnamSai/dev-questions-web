import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";
import RichTextEditor from "../components/RichTextEditor";
import RichTextView from "../components/RichTextView";
import CodeCard from "../components/CodeCard";
import Select from "../components/Select";
import Checkbox from "../components/Checkbox";

const COMMON_LANGUAGES = [
  "javascript", "typescript", "python", "java", "go", "rust", "c", "cpp",
  "csharp", "php", "ruby", "swift", "kotlin", "sql", "bash", "html", "css",
  "json", "yaml", "text",
];

const LANG_COLORS = {
  javascript: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  typescript: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  python: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  default: "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400",
};

function EmptyForm() {
  return { title: "", language: "javascript", code: "", description: "", tags: "", isPublic: false };
}

export default function SnippetLibrary() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mineOnly, setMineOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EmptyForm());
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const { confirm, confirmProps } = useConfirm();

  useEffect(() => {
    load();
  }, [mineOnly]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/dev-tools/snippets", { params: { mine: mineOnly } });
      setSnippets(data);
    } catch {
      toast.error("Failed to load snippets");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      if (langFilter && s.language !== langFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${s.title} ${(s.tags || []).join(" ")} ${s.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [snippets, search, langFilter]);

  const languages = useMemo(
    () => [...new Set(snippets.map((s) => s.language))].sort(),
    [snippets],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EmptyForm());
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      title: s.title,
      language: s.language,
      code: s.code,
      description: s.description || "",
      tags: (s.tags || []).join(", "),
      isPublic: s.isPublic,
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!form.title.trim() || !form.code.trim()) {
      toast.error("Title and code are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      language: form.language,
      code: form.code,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isPublic: form.isPublic,
    };
    try {
      if (editing) {
        const { data } = await api.patch(`/dev-tools/snippets/${editing.id}`, payload);
        setSnippets((prev) => prev.map((s) => (s.id === editing.id ? data : s)));
        toast.success("Snippet updated");
      } else {
        const { data } = await api.post("/dev-tools/snippets", payload);
        setSnippets((prev) => [data, ...prev]);
        toast.success("Snippet saved");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save snippet");
    } finally {
      setSaving(false);
    }
  };

  const deleteSnippet = (s) => {
    confirm({
      title: "Delete this snippet?",
      message: `"${s.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await api.delete(`/dev-tools/snippets/${s.id}`);
          setSnippets((prev) => prev.filter((x) => x.id !== s.id));
          toast.success("Deleted");
        } catch {
          toast.error("Failed to delete");
        }
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            📚 Snippet Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Save reusable code snippets, tag them, and share the useful ones with the team.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + New Snippet
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setMineOnly(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!mineOnly ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"}`}
        >
          🌍 All visible
        </button>
        <button
          onClick={() => setMineOnly(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mineOnly ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"}`}
        >
          👤 Mine only
        </button>
        <Select
          value={langFilter}
          onChange={setLangFilter}
          className="w-auto"
          options={[{ value: "", label: "All languages" }, ...languages.map((l) => ({ value: l, label: l }))]}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, tags…"
          className="input-light flex-1 min-w-[160px] text-xs py-1.5"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No snippets yet. Save your first one above.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {filtered.map((s) => (
            <div key={s.id} className="glass-card overflow-hidden">
              <div className="p-4 space-y-2">
                {/* Fixed-height content block so every card in the grid lines up —
                    "Expand" below lifts this cap along with the code preview. */}
                <div className={expanded === s.id ? "" : "h-[122px] overflow-hidden"}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${LANG_COLORS[s.language] || LANG_COLORS.default}`}>
                          {s.language}
                        </span>
                        {s.isPublic && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            🌍 Public
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold text-slate-800 dark:text-slate-100 mt-1 ${expanded === s.id ? "" : "truncate"}`}>
                        {s.title}
                      </h3>
                      {s.userId !== user?.id && (
                        <p className="text-[10px] text-slate-400">by {s.userName}</p>
                      )}
                    </div>
                  </div>

                  {s.description && (
                    <RichTextView
                      html={s.description}
                      className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${expanded === s.id ? "" : "line-clamp-2"}`}
                    />
                  )}

                  {s.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.tags.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Code preview */}
                <CodeCard
                  code={s.code}
                  language={s.language}
                  title={s.title}
                  maxHeight={expanded === s.id ? undefined : "6rem"}
                />

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    {expanded === s.id ? "▲ Show Less" : "▼ View More"}
                  </button>
                  {s.userId === user?.id && (
                    <>
                      <button
                        onClick={() => openEdit(s)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSnippet(s)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {editing ? "Edit Snippet" : "New Snippet"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Debounce hook"
                      className="input-light"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Language</label>
                    <Select
                      value={form.language}
                      onChange={(v) => setForm((f) => ({ ...f, language: v }))}
                      options={COMMON_LANGUAGES.map((l) => ({ value: l, label: l }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
                  <RichTextEditor
                    value={form.description}
                    onChange={(html) => setForm((f) => ({ ...f, description: html }))}
                    placeholder="What does this snippet do?"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Tags (comma separated)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="react, hooks, performance"
                    className="input-light"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Code *</label>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <textarea
                      value={form.code}
                      onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const s = e.target.selectionStart;
                          const newCode = form.code.slice(0, s) + "  " + form.code.slice(e.target.selectionEnd);
                          setForm((f) => ({ ...f, code: newCode }));
                          setTimeout(() => e.target.setSelectionRange(s + 2, s + 2), 0);
                        }
                      }}
                      spellCheck={false}
                      rows={10}
                      placeholder="Paste or write your snippet…"
                      className="w-full p-4 bg-[#0d1117] text-emerald-300 font-mono text-sm leading-relaxed outline-none resize-none placeholder-slate-600"
                    />
                  </div>
                </div>

                <Checkbox
                  checked={form.isPublic}
                  onChange={(v) => setForm((f) => ({ ...f, isPublic: v }))}
                  label="🌍 Share publicly with the team"
                  className="text-base font-medium text-slate-700 dark:text-slate-200"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitForm}
                    disabled={saving}
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                  >
                    {saving ? "Saving…" : editing ? "Save Changes" : "Save Snippet"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal {...confirmProps} />
    </motion.div>
  );
}
