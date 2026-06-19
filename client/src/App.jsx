import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import Snowfall from "./components/Snowfall";
import Rain from "./components/Rain";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { WeatherProvider, useWeather } from "./context/WeatherContext";
import { requestAndRegisterToken } from "./firebase";
import api from "./api/axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";
import Community from "./pages/Community";
import MyQuestions from "./pages/MyQuestions";
import Bookmarks from "./pages/Bookmarks";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Quiz from "./pages/Quiz";
import QuestionDetail from "./pages/QuestionDetail";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
      <BottomNav />
      <ScrollToTopBtn />
    </div>
  );
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        <PageWrapper>{children}</PageWrapper>
      </AppLayout>
    </ProtectedRoute>
  );
}

// Applies weather class to <html> and renders weather effects
function WeatherEffects() {
  const { activeCondition } = useWeather();
  const { snow } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    const conditions = ["sunny","cloudy","foggy","rainy","snowy","stormy"];
    conditions.forEach(c => html.classList.remove(`weather-${c}`));
    if (activeCondition) html.classList.add(`weather-${activeCondition}`);
    return () => conditions.forEach(c => html.classList.remove(`weather-${c}`));
  }, [activeCondition]);

  const showSnow = snow || activeCondition === "snowy";
  const showRain = activeCondition === "rainy" || activeCondition === "stormy";

  return (
    <>
      {showSnow && <Snowfall />}
      {showRain && <Rain heavy={activeCondition === "stormy"} />}
    </>
  );
}

function NotificationBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      // Show banner after 2s so user has landed on the page
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, [user]);

  const allow = async () => {
    setShow(false);
    await requestAndRegisterToken(api);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium"
      >
        <span>🔔 Enable notifications to get alerts on new questions & comments</span>
        <button
          onClick={allow}
          className="bg-white text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-50 transition"
        >
          Allow
        </button>
        <button onClick={() => setShow(false)} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
      </motion.div>
    </AnimatePresence>
  );
}

function AppInner() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const toastStyle = theme === "dark"
    ? { background: "#1e293b", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.08)" }
    : { background: "#ffffff", color: "#0f172a", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 8px 24px rgba(99,102,241,0.12)" };

  return (
    <>
      <WeatherEffects />
      <NotificationBanner />
      <Toaster
        position="top-right"
        toastOptions={{ style: toastStyle, borderRadius: "12px" }}
      />
      <Routes>
        <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard"    element={<ProtectedPage><Dashboard /></ProtectedPage>} />
        <Route path="/generate"     element={<ProtectedPage><Generator /></ProtectedPage>} />
        <Route path="/community"    element={<ProtectedPage><Community /></ProtectedPage>} />
        <Route path="/my-questions" element={<ProtectedPage><MyQuestions /></ProtectedPage>} />
        <Route path="/bookmarks"    element={<ProtectedPage><Bookmarks /></ProtectedPage>} />
        <Route path="/leaderboard"  element={<ProtectedPage><Leaderboard /></ProtectedPage>} />
        <Route path="/admin"           element={<ProtectedPage><Admin /></ProtectedPage>} />
        <Route path="/quiz"            element={<ProtectedPage><Quiz /></ProtectedPage>} />
        <Route path="/question/:id"    element={<ProtectedPage><QuestionDetail /></ProtectedPage>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <AppInner />
    </WeatherProvider>
  );
}
