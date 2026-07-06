import { motion } from "framer-motion";

const PRESETS = {
  sm: { width: 32, height: 18, knob: 14 },
  md: { width: 44, height: 24, knob: 20 },
  compact: { width: 38, height: 22, knob: 16 },
};

export default function Toggle({ on, onToggle, color = "bg-indigo-500", disabled = false, size = "md" }) {
  const dims = PRESETS[size] || PRESETS.md;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      className={`rounded-full relative transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${on ? color : "bg-slate-300 dark:bg-slate-600"}`}
      style={{ height: dims.height, width: dims.width }}
    >
      <motion.div
        className="absolute rounded-full bg-white shadow"
        style={{ top: (dims.height - dims.knob) / 2, width: dims.knob, height: dims.knob }}
        animate={{ left: on ? dims.width - dims.knob - 2 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
