import { useEffect, useState } from "react";

const STORAGE_KEY = "devquiz_zoom_level";
const MIN_ZOOM = 75;
const MAX_ZOOM = 150;
const STEP = 10;

function applyZoom(level) {
  document.documentElement.style.zoom = `${level}%`;
}

export default function ZoomControl() {
  const [zoom, setZoom] = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(saved) ? saved : 100;
  });

  useEffect(() => {
    applyZoom(zoom);
    localStorage.setItem(STORAGE_KEY, String(zoom));
  }, [zoom]);

  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - STEP));
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + STEP));
  const reset = () => setZoom(100);

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/8 px-1 py-1" title="Page zoom">
      <button
        onClick={zoomOut}
        disabled={zoom <= MIN_ZOOM}
        className="w-6 h-6 flex items-center justify-center rounded text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold"
        title="Zoom out"
      >
        −
      </button>
      <button
        onClick={reset}
        className="px-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors tabular-nums"
        title="Reset zoom"
      >
        {zoom}%
      </button>
      <button
        onClick={zoomIn}
        disabled={zoom >= MAX_ZOOM}
        className="w-6 h-6 flex items-center justify-center rounded text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold"
        title="Zoom in"
      >
        +
      </button>
    </div>
  );
}
