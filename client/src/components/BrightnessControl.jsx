import { useEffect, useState } from "react";

const STORAGE_KEY = "devquiz_brightness_level";
const MIN_BRIGHTNESS = 70;
const MAX_BRIGHTNESS = 130;
const STEP = 10;

const OVERLAY_ID = "devquiz-brightness-overlay";

// Deliberately NOT using CSS `filter` on <html>/<body> — filter (like
// transform) creates a new containing block for `position: fixed` descendants,
// which silently breaks every full-screen fixed overlay in the app (modals,
// the Jitsi meeting room, etc.) the moment brightness is adjusted away from
// 100%. A blended, click-through overlay achieves the same visual effect
// without touching how anything else is positioned.
function applyBrightness(level) {
  let overlay = document.getElementById(OVERLAY_ID);
  if (level === 100) {
    overlay?.remove();
    return;
  }
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "2147483647", // always on top, but never blocks clicks
    });
    document.body.appendChild(overlay);
  }
  if (level < 100) {
    overlay.style.backgroundColor = "black";
    overlay.style.mixBlendMode = "multiply";
    overlay.style.opacity = String((100 - level) / 100);
  } else {
    overlay.style.backgroundColor = "white";
    overlay.style.mixBlendMode = "screen";
    overlay.style.opacity = String((level - 100) / 100);
  }
}

export default function BrightnessControl() {
  const [brightness, setBrightness] = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(saved) ? saved : 100;
  });

  useEffect(() => {
    applyBrightness(brightness);
    localStorage.setItem(STORAGE_KEY, String(brightness));
  }, [brightness]);

  const decrease = () => setBrightness((b) => Math.max(MIN_BRIGHTNESS, b - STEP));
  const increase = () => setBrightness((b) => Math.min(MAX_BRIGHTNESS, b + STEP));
  const reset = () => setBrightness(100);

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/8 px-1 py-1" title="Screen brightness">
      <button
        type="button"
        onClick={decrease}
        disabled={brightness <= MIN_BRIGHTNESS}
        className="w-6 h-6 flex items-center justify-center rounded text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
        title="Decrease brightness"
      >
        🔅
      </button>
      <button
        type="button"
        onClick={reset}
        disabled={brightness === 100}
        className="px-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors tabular-nums disabled:cursor-default"
        title="Reset brightness to 100%"
      >
        {brightness}%
      </button>
      <button
        type="button"
        onClick={increase}
        disabled={brightness >= MAX_BRIGHTNESS}
        className="w-6 h-6 flex items-center justify-center rounded text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
        title="Increase brightness"
      >
        🔆
      </button>
    </div>
  );
}
