import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({ open, title, message, confirmLabel = "Delete", confirmClass, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
        style={{ minHeight: "100vh" }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.18 }}
          className="glass-card w-full max-w-sm p-6 space-y-4 shadow-2xl mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🗑</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
              {message && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={confirmClass || "px-4 py-2 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
