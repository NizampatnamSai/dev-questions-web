import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
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
import { requestAndRegisterToken, onForegroundMessage } from "./firebase";
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
import StudyGuide from "./pages/StudyGuide";
import MockInterview from "./pages/MockInterview";
import Flashcards from "./pages/Flashcards";
import Progress from "./pages/Progress";

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

  useEffect(() => {
    if (!user) return;
    if (!("Notification" in window)) return;
    // Already granted — silently re-register (handles login switch)
    if (Notification.permission === "granted") {
      requestAndRegisterToken(api);
    }
    // permission "default" or "denied" — do nothing; we no longer show a custom banner
    // to avoid the double-prompt (our banner + browser dialog) that confused users.
  }, [user?.id]);

  return null;
}

function AppInner() {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Show foreground FCM notifications as a toast (browser doesn't show them automatically when app is open)
  useEffect(() => {
    if (!user) return;
    const unsub = onForegroundMessage(({ notification, data }) => {
      const title = notification?.title ?? "DevQuiz";
      const body  = notification?.body  ?? "";
      toast(
        <div className="flex items-start gap-2">
          <img src="/logo192.png" className="w-8 h-8 rounded-lg flex-shrink-0" alt="" />
          <div>
            <p className="font-semibold text-sm">{title}</p>
            {body && <p className="text-xs opacity-80 mt-0.5">{body}</p>}
          </div>
        </div>,
        { duration: 6000, style: { padding: "10px 14px" } }
      );
    });
    return () => unsub?.();
  }, [user]);

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
        <Route path="/study"           element={<ProtectedPage><StudyGuide /></ProtectedPage>} />
        <Route path="/mock-interview"  element={<ProtectedPage><MockInterview /></ProtectedPage>} />
        <Route path="/flashcards"      element={<ProtectedPage><Flashcards /></ProtectedPage>} />
        <Route path="/progress"        element={<ProtectedPage><Progress /></ProtectedPage>} />
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
