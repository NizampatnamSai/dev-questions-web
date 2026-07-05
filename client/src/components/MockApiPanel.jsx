import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const MOCK_RESOURCES = [
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "products", label: "Products" },
  { id: "todos", label: "Todos" },
  { id: "comments", label: "Comments" },
  { id: "images", label: "Images" },
];

// Built from VITE_API_URL, which Vite bakes in at build time from
// .env.development / .env.production — so this automatically points at the
// real prod API domain once deployed, no code change needed.
export default function MockApiPanel() {
  const [resource, setResource] = useState("users");
  const [count, setCount] = useState(10);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
  const fullUrl = `${apiUrl}/dev-tools/mock/${resource}?count=${count}`;

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/dev-tools/mock/${resource}`, { params: { count } });
      setPreview(data);
    } catch {
      toast.error("Failed to load preview");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    const absolute = fullUrl.startsWith("http") ? fullUrl : `${window.location.origin}${fullUrl}`;
    navigator.clipboard.writeText(absolute);
    toast.success("URL copied");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {MOCK_RESOURCES.map((r) => (
          <button
            key={r.id}
            onClick={() => { setResource(r.id); setPreview(null); }}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${resource === r.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 dark:text-slate-400">Count:</label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => { setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1))); setPreview(null); }}
          className="w-20 px-2 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <span className="text-xs text-slate-400">(max 100)</span>
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono truncate">
          GET {fullUrl}
        </code>
        <button onClick={copy} className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          📋 Copy URL
        </button>
      </div>

      <button
        onClick={load}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        {loading ? "Loading…" : "▶ Preview Response"}
      </button>

      {preview && resource === "images" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#0d1117] rounded-xl max-h-72 overflow-y-auto">
          {preview.data.map((img) => (
            <div key={img.id} className="rounded-lg overflow-hidden bg-slate-800">
              <img src={img.thumbnailUrl} alt={img.title} className="w-full h-20 object-cover" loading="lazy" />
              <p className="text-[10px] text-slate-300 px-1.5 py-1 truncate">{img.title}</p>
            </div>
          ))}
        </div>
      )}
      {preview && (
        <pre className="text-xs p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono bg-[#0d1117] text-emerald-400 rounded-xl max-h-72 overflow-y-auto">
          {JSON.stringify(preview, null, 2)}
        </pre>
      )}
      <p className="text-[11px] text-slate-400">
        No login required — paste the URL above into API Tester, Postman, or your own frontend code. Same resource + count always returns the same data.
      </p>
    </div>
  );
}
