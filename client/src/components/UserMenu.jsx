import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

export default function UserMenu() {
  const { user, logout, profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const avatarUrl = profile?.avatar_url || null;

  useEffect(() => {
    if (!user || user.isGuest) return;
    // Re-sync when profile page fires avatar update event
    const reload = () => {
      import("../api/axios").then(({ default: api }) => {
        api.get("/profile/my/profile").then(({ data }) => setProfile(data)).catch(() => {});
      });
    };
    window.addEventListener("avatar-updated", reload);
    return () => window.removeEventListener("avatar-updated", reload);
  }, [user?.id]);

  if (!user || user.isGuest) return null;

  const initials = user?.name
    ?.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div className="relative">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center px-1.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="My Profile"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow">
                {initials}
              </div>
            )}
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors px-0.5"
            title="More options"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L1 3h10L6 8z"/>
            </svg>
          </button>
        </div>

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
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shadow">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 capitalize truncate">{user.role}</p>
                    </div>
                  </div>
                  <div className="border-t border-black/10 dark:border-white/10 pt-3 space-y-1">
                    <button
                      onClick={() => { setOpen(false); navigate("/profile"); }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
                    >
                      <span className="text-base">👤</span>
                      My Profile
                    </button>
                    <button
                      onClick={() => { setOpen(false); setConfirmLogout(true); }}
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
