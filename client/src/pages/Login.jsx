import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@devquiz.com", password: "Admin@123" },
  { label: "John (User)", email: "john@devquiz.com", password: "User@123" },
  { label: "Jane (User)", email: "jane@devquiz.com", password: "User@123" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <span className="text-3xl">🧠</span>
          <h1 className="text-2xl font-bold mt-2">DevQuiz</h1>
          <p className="text-sm text-slate-400">AI Frontend Interview Questions</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          No account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-xs text-slate-500 mb-2">Demo accounts (click to autofill):</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.password);
                }}
                className="text-xs px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/10 text-slate-300"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
