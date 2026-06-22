import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await register(name, email, password);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto text-3xl">⏳</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Awaiting Approval</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your account request has been sent to the admin.<br />
            You'll receive a notification once it's approved.
          </p>
          <Link to="/login" className="inline-block mt-2 text-sm text-cyan-400 hover:underline">← Back to login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm disabled:opacity-60"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm disabled:opacity-60"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
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
          <button
            type="submit"
            disabled={loading}
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
      </motion.div>
    </div>
  );
}
