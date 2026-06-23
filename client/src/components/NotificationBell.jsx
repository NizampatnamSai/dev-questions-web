import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

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

  if (!user || user.isGuest) return null;

  return (
    <motion.button
      onClick={() => { setUnreadCount(0); navigate("/notifications"); }}
      className="relative p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0"
      animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
      transition={{ duration: 0.6, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
      title="Notifications"
    >
      <span className="text-xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </motion.button>
  );
}
