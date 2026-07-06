import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { requestAndRegisterToken } from "../firebase";
import api from "../api/axios";
import Footer from "../components/Footer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const [guestConfig, setGuestConfig] = useState({ guest_mode_enabled: true, guest_mode_message: "" });
  const { register, enterGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/app-config/public").then(({ data }) => setGuestConfig(data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setSubmitted(true);
      // Auto-request if already granted (e.g. returning user)
      if ("Notification" in window && Notification.permission === "granted") {
        try { await requestAndRegisterToken(api); setNotifGranted(true); } catch {}
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message;
      const message = detail || (err.message === "Network Error" ? "Network error — check your connection" : "Registration failed");
      toast.error(message, { duration: 5000 });
      console.error("Register error:", err.message, err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto text-3xl">⏳</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Awaiting Approval</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your account request has been sent to the admin.<br />
            You'll be notified once it's reviewed.
          </p>
          {notifGranted ? (
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 rounded-xl px-4 py-2.5">
              <span>🔔</span>
              <span>Notifications enabled — you'll be alerted when approved or rejected.</span>
            </div>
          ) : (
            <button
              onClick={async () => {
                if (!("Notification" in window)) return;
                try {
                  const perm = await Notification.requestPermission();
                  if (perm === "granted") {
                    await requestAndRegisterToken(api);
                    setNotifGranted(true);
                  } else {
                    toast.error("Please enable notifications in your browser settings to get approval alerts.");
                  }
                } catch {}
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
            >
              🔔 Enable Notifications to get approval alert
            </button>
          )}
          <Link to="/login" className="inline-block mt-2 text-sm text-cyan-400 hover:underline">← Back to login</Link>
        </motion.div>
        <div className="w-full mt-4">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <span className="text-3xl">🧠</span>
          <h1 className="text-2xl font-bold mt-2">Create account</h1>
          <p className="text-sm text-slate-400">Join the DevQuiz community</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              required
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm disabled:opacity-60"
            />
          </div>
          <div>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm disabled:opacity-60"
            />
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              className="w-full px-4 py-2.5 pr-11 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition text-sm select-none"
              tabIndex={-1}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          {password && password.length < 6 && (
            <p className="text-xs text-amber-400">Password must be at least 6 characters</p>
          )}
          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim() || password.length < 6}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating…
              </>
            ) : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          {loading ? (
            <span className="text-slate-500 cursor-not-allowed">Sign in</span>
          ) : (
            <Link to="/login" className="text-cyan-400 hover:underline">Sign in</Link>
          )}
        </p>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-xs text-slate-500 bg-slate-900">or</span>
          </div>
        </div>

        {guestConfig.guest_mode_enabled === false ? (
          <div className="text-xs text-center text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
            🕶️ {guestConfig.guest_mode_message || "Guest mode is temporarily disabled by the admin. Please log in or create an account to continue."}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              enterGuest();
              navigate("/dashboard");
            }}
            className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            👁 View as Guest
            <span className="text-xs text-slate-500 font-normal">
              — browse without signing in
            </span>
          </button>
        )}
      </motion.div>
      <div className="w-full mt-4">
        <Footer />
      </div>
    </div>
  );
}
