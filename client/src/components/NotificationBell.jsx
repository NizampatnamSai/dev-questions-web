import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNotificationCount } from "../hooks/useNotificationCount";

export default function NotificationBell() {
  const { user } = useAuth();
  const { count } = useNotificationCount();
  const navigate = useNavigate();

  if (!user || user.isGuest) return null;

  return (
    <motion.button
      onClick={() => {
        navigate("/notifications");
      }}
      className="relative p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0"
      animate={count > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
      transition={{
        duration: 0.6,
        repeat: count > 0 ? Infinity : 0,
        repeatDelay: 3,
      }}
      title="Notifications"
    >
      <span className="text-xl">🔔</span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </motion.button>
  );
}
