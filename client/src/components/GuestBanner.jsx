import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Navigate first, then log out only once the route transition has actually
// painted. A single setTimeout(fn, 0) wasn't always enough — React Router's
// location context can still be one render behind on the very next macrotask,
// so /dashboard's own auth guard occasionally saw user=null while it was
// still (transiently) the matched route, and its own redirect to /login won
// the race against navigate("/register"). Waiting two animation frames
// guarantees at least one full paint has happened with the new route before
// auth state changes, so there's no window left for a stale route to react to.
function navigateThenLogout(navigate, logout, path) {
  navigate(path);
  requestAnimationFrame(() => requestAnimationFrame(logout));
}

export default function GuestBanner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user?.isGuest) return null;

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between gap-3 text-sm flex-wrap">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <span>👁</span>
        <span className="font-medium">Guest Mode</span>
        <span className="text-amber-500/70 dark:text-amber-500 hidden sm:inline">— You can browse but not save or create anything.</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateThenLogout(navigate, logout, "/register")}
          className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold transition"
        >
          Sign Up Free
        </button>
        <button
          onClick={() => navigateThenLogout(navigate, logout, "/login")}
          className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
