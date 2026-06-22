import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!", { id: "welcome" });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <img src="/logo192.png" alt="DevQuiz" className="w-16 h-16 rounded-2xl mx-auto shadow-lg shadow-indigo-500/30" />
          <h1 className="text-2xl font-bold mt-3">DevQuiz</h1>
          <p className="text-sm text-slate-400">AI Interview Prep</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
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
                Signing in…
              </>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          No account?{" "}
          {loading ? (
            <span className="text-slate-500 cursor-not-allowed">Register</span>
          ) : (
            <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
          )}
        </p>

      </motion.div>
    </div>
  );
}
