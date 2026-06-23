import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (!user || user.isGuest) return null;

  const initials = user?.name
    ?.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title={user.name}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow">
            {initials}
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                className="absolute top-full right-0 mt-2 w-56 sm:w-64 glass rounded-2xl shadow-lg z-50 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shadow">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 capitalize truncate">{user.role}</p>
                    </div>
                  </div>
                  <div className="border-t border-black/10 dark:border-white/10 pt-3">
                    <button
                      onClick={() => {
                        setOpen(false);
                        setConfirmLogout(true);
                      }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 text-sm font-medium transition-colors"
                    >
                      <span className="text-base">⎋</span>
                      Log out
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <ConfirmModal
        open={confirmLogout}
        title="Log out?"
        message="You'll need to sign in again to access your account."
        confirmLabel="Log Out"
        onConfirm={() => { setConfirmLogout(false); logout(); }}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
}
