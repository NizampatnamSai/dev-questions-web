import { useState } from "react";
import { NavLink } from "react-router-dom";
import MobileSettingsSheet from "./MobileSettingsSheet";

const links = [
  { to: "/dashboard",    label: "Home",     icon: "📊" },
  { to: "/generate",     label: "Generate", icon: "✨" },
  { to: "/quiz",         label: "Quiz",     icon: "🧠" },
  { to: "/study",        label: "Study",    icon: "📚" },
  { to: "/community",    label: "Feed",     icon: "🌍" },
];

export default function BottomNav() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-black/5 dark:border-white/10 flex justify-around py-2">
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

        {/* Settings tab */}
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
