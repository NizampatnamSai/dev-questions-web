import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function GuestLockedModal({ open, onClose }) {
  const navigate = useNavigate();

  const contactAdmin = () => {
    onClose();
    window.dispatchEvent(new CustomEvent("open-feedback-modal"));
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        // A single fixed+flex wrapper centers the panel via flexbox instead of
        // top/left percentages + translate — the latter combination visibly
        // drifts off-center under this app's CSS `zoom` page-scaling feature
        // (ZoomControl.jsx sets document.documentElement.style.zoom), a known
        // Chromium quirk with position:fixed + percentage offsets under zoom.
        // Flexbox centering doesn't rely on those percentage calculations, so
        // it stays correct at any zoom level. Same technique already used by
        // the working image lightbox in AdminChat.jsx.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 text-center space-y-4">
              <div className="text-4xl">🔒</div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  This page needs an account
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  You're browsing as a guest. Log in to unlock this page, or reach
                  out for access.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                  Create Account
                </button>
                <button
                  onClick={contactAdmin}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  ✉️ Contact admin for access
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
