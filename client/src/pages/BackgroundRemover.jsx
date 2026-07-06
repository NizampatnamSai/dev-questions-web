import { useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function BackgroundRemover() {
  const [original, setOriginal] = useState(null); // { file, url }
  const [resultUrl, setResultUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(null); // { label, pct }
  const fileInputRef = useRef(null);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10MB)");
      return;
    }
    setOriginal({ file, url: URL.createObjectURL(file) });
    setResultUrl(null);
  }

  async function process() {
    if (!original) return;
    setProcessing(true);
    setProgress({ label: "Loading model…", pct: 0 });
    try {
      // Loaded on demand — this model is never part of our app bundle, so
      // pages that don't use this feature pay zero extra download cost.
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(original.file, {
        model: "isnet_quint8", // smallest/fastest quantized model — matters since it downloads client-side
        progress: (key, current, total) => {
          setProgress({ label: key, pct: total ? Math.round((current / total) * 100) : 0 });
        },
      });
      setResultUrl(URL.createObjectURL(blob));
      toast.success("Background removed!");
    } catch (err) {
      // This runs entirely client-side (WASM/ONNX model, no backend involved),
      // so the only way to diagnose a real failure is the browser console —
      // a bare `catch {}` here was swallowing the actual error entirely.
      console.error("Background removal failed:", err);
      const msg = String(err?.message || err || "");
      if (/fetch|network|NetworkError|Failed to fetch/i.test(msg)) {
        toast.error("Couldn't download the AI model (network issue) — check your connection and try again.");
      } else if (/memory|out of memory|Aborted/i.test(msg)) {
        toast.error("Image too complex for this device's memory — try a smaller image.");
      } else {
        toast.error("Background removal failed — try a different image.");
      }
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  }

  function download() {
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "background-removed.png";
    link.click();
  }

  function reset() {
    setOriginal(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto text-slate-800 dark:text-white">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🖼️</div>
        <h1 className="text-3xl font-bold mb-2">Background Remover</h1>
        <p className="text-slate-400 text-sm">
          Runs entirely in your browser — no upload, no API key, no cost, no daily limit.
        </p>
      </div>

      {!original ? (
        <div className="glass-card p-8 text-center space-y-4">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="bg-file-input" />
          <label
            htmlFor="bg-file-input"
            className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer transition-colors"
          >
            📁 Choose an Image
          </label>
          <p className="text-xs text-slate-400">PNG, JPG, or WebP — max 10MB</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Original</p>
              <img src={original.url} alt="Original" className="w-full rounded-xl max-h-96 object-contain bg-slate-100 dark:bg-slate-900" />
            </div>
            <div className="glass-card p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Result</p>
              {resultUrl ? (
                <div
                  className="w-full rounded-xl max-h-96 flex items-center justify-center"
                  style={{ backgroundImage: "conic-gradient(#e5e7eb 90deg, transparent 90deg 180deg, #e5e7eb 180deg 270deg, transparent 270deg)", backgroundSize: "20px 20px" }}
                >
                  <img src={resultUrl} alt="Background removed" className="max-w-full max-h-96 object-contain" />
                </div>
              ) : (
                <div className="w-full h-64 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
                  {processing ? (
                    <div className="text-center space-y-2 px-4">
                      <span className="block w-6 h-6 mx-auto border-2 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />
                      <span className="block">{progress?.label || "Processing…"}</span>
                      {progress?.pct > 0 && <span className="block text-xs">{progress.pct}%</span>}
                    </div>
                  ) : (
                    "Click Remove Background below"
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {!resultUrl && (
              <button
                onClick={process}
                disabled={processing}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all"
              >
                {processing ? "Processing…" : "✨ Remove Background"}
              </button>
            )}
            {resultUrl && (
              <button onClick={download} className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white transition-all">
                ⬇ Download PNG
              </button>
            )}
            <button onClick={reset} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all">
              ↺ New Image
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            First use downloads a small AI model to your browser (cached after that) — this can take a few seconds on a slow connection.
          </p>
        </motion.div>
      )}
    </div>
  );
}
