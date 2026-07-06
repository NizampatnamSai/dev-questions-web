import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestBanner() {
  const { user } = useAuth();
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
        {/* Plain navigate() — no logout() beforehand. Both /register and
            /login already render fine for a guest user (their own route
            guards in App.jsx only redirect away a REAL logged-in user —
            `user && !user.isGuest` — which is false for a guest), and
            neither Register.jsx nor Login.jsx reads user state at all. The
            guest flag doesn't need to be cleared here either: login() already
            removes "devquiz_guest" from localStorage on success, and
            registration itself doesn't log anyone in immediately (new
            accounts need admin approval first). Three earlier attempts all
            tried to end the guest session before switching pages and each
            hit a different flavor of the same race against ProtectedRoute's
            own "not logged in" redirect — the logout() call was never
            actually necessary in the first place. */}
        <button
          onClick={() => navigate("/register")}
          className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold transition"
        >
          Sign Up Free
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
