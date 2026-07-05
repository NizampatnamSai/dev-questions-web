import { useState, useMemo } from "react";
import toast from "react-hot-toast";

const MODES = [
  { id: "px-rem", label: "PX ↔ REM" },
  { id: "px-em", label: "PX ↔ EM" },
  { id: "color", label: "Color (HEX/RGB/HSL)" },
];

function copy(text) {
  navigator.clipboard.writeText(text);
  toast.success("Copied");
}

// ── PX <-> REM / EM ──────────────────────────────────────────────────────────
function PxUnitConverter({ unitLabel }) {
  const [base, setBase] = useState(16);
  const [px, setPx] = useState(16);

  const unitValue = useMemo(() => (px / (base || 16)).toFixed(4).replace(/\.?0+$/, ""), [px, base]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Pixels (px)</label>
          <input
            type="number"
            value={px}
            onChange={(e) => setPx(Number(e.target.value) || 0)}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {unitLabel === "rem" ? "Root font size (px)" : "Parent font size (px)"}
          </label>
          <input
            type="number"
            value={base}
            onChange={(e) => setBase(Number(e.target.value) || 16)}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-mono">
          {px}px = {unitValue}{unitLabel}
        </code>
        <button
          onClick={() => copy(`${unitValue}${unitLabel}`)}
          className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          📋 Copy
        </button>
      </div>
      <p className="text-[11px] text-slate-400">
        {unitLabel === "rem"
          ? "rem is always relative to the root (<html>) font size, regardless of nesting."
          : "em is relative to the font size of the element it's used on (or its parent for most properties) — it compounds when nested."}
      </p>
    </div>
  );
}

// ── Color conversions ────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function ColorConverter() {
  const [hex, setHex] = useState("#6366f1");
  const rgb = useMemo(() => hexToRgb(hex) || { r: 0, g: 0, b: 0 }, [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const valid = !!hexToRgb(hex);

  const setFromRgb = (next) => setHex(rgbToHex(next));
  const setFromHsl = (next) => setHex(rgbToHex(hslToRgb(next)));

  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={valid ? hex : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className="w-14 h-14 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer bg-transparent"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#6366f1"
          className={`flex-1 px-3 py-2 rounded-lg border ${valid ? "border-slate-200 dark:border-slate-600" : "border-red-400"} bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono outline-none focus:ring-2 focus:ring-indigo-400`}
        />
      </div>
      {!valid && <p className="text-xs text-red-400">Not a valid hex color</p>}

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {["r", "g", "b"].map((k) => (
          <div key={k}>
            <label className="text-[10px] uppercase font-bold text-slate-400">{k}</label>
            <input
              type="number" min={0} max={255}
              value={rgb[k]}
              onChange={(e) => setFromRgb({ ...rgb, [k]: Number(e.target.value) || 0 })}
              className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}
        {[["h", 360], ["s", 100], ["l", 100]].map(([k, max]) => (
          <div key={k}>
            <label className="text-[10px] uppercase font-bold text-slate-400">{k}</label>
            <input
              type="number" min={0} max={max}
              value={hsl[k]}
              onChange={(e) => setFromHsl({ ...hsl, [k]: Number(e.target.value) || 0 })}
              className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {[["HEX", valid ? hex : "invalid"], ["RGB", rgbStr], ["HSL", hslStr]].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] w-8 font-bold text-slate-400">{label}</span>
            <code className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-mono truncate">{value}</code>
            <button onClick={() => copy(value)} className="text-[10px] px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">📋</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CssCalculatorPanel() {
  const [mode, setMode] = useState("px-rem");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${mode === m.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode === "px-rem" && <PxUnitConverter unitLabel="rem" />}
      {mode === "px-em" && <PxUnitConverter unitLabel="em" />}
      {mode === "color" && <ColorConverter />}
    </div>
  );
}
