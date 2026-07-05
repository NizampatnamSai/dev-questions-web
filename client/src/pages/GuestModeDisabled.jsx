import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestModeDisabled({ message }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col items-center justify-center z-[9999] text-center px-6">
      <div className="text-7xl mb-6 opacity-80">🕶️</div>

      <h1 className="text-3xl font-bold text-white mb-3">Guest Mode Disabled</h1>

      <p className="text-slate-300 text-base max-w-sm leading-relaxed mb-8">
        {message || "Guest mode is temporarily disabled by the admin. Please log in or create an account to continue."}
      </p>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
      >
        Go to Login
      </button>
    </div>
  );
}
