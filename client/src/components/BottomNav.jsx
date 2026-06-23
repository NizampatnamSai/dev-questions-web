import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MobileSettingsSheet from "./MobileSettingsSheet";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const links = [
  { to: "/dashboard",    label: "Home",     icon: "📊" },
  { to: "/generate",     label: "Generate", icon: "✨" },
  { to: "/quiz",         label: "Quiz",     icon: "🧠" },
  { to: "/community",    label: "Feed",     icon: "🌍" },
];

export default function BottomNav() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isGuest) return;
    const fetch = () =>
      api.get("/admin/notifications/my/unread-count")
        .then(({ data }) => setUnreadCount(data.count || 0))
        .catch(() => {});
    fetch();
    const timer = setInterval(fetch, 60000);
    return () => clearInterval(timer);
  }, [user?.id]);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-black/5 dark:border-white/10 flex justify-around py-2 pb-safe">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-[11px] px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-indigo-500 dark:text-cyan-300"
                  : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {/* Bell */}
        {!user?.isGuest && (
          <button
            onClick={() => { setUnreadCount(0); navigate("/notifications"); }}
            className="relative flex flex-col items-center text-[11px] px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
          >
            <span className="text-lg relative">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            Alerts
          </button>
        )}

        {/* More / Settings tab */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex flex-col items-center text-[11px] px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-300 transition-colors"
        >
          <span className="text-lg">⚙️</span>
          More
        </button>
      </nav>

      <MobileSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
