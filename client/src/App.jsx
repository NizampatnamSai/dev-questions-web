import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import GlobalSearch from "./components/GlobalSearch";
import NotificationBell from "./components/NotificationBell";
import UserMenu from "./components/UserMenu";
import FeedbackModal from "./components/FeedbackModal";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Snowfall from "./components/Snowfall";
import Rain from "./components/Rain";
import GuestBanner from "./components/GuestBanner";
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
import Drafts from "./pages/Drafts";
import AskAI from "./pages/AskAI";
import Bookmarks from "./pages/Bookmarks";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Quiz from "./pages/Quiz";
import QuestionDetail from "./pages/QuestionDetail";
import StudyGuide from "./pages/StudyGuide";
import MockInterview from "./pages/MockInterview";
import Flashcards from "./pages/Flashcards";
import Progress from "./pages/Progress";
import JsCompiler from "./pages/JsCompiler";
import ProjectGuide from "./pages/ProjectGuide";
import JSChallenge from "./pages/JSChallenge";
import WorkBoard from "./pages/WorkBoard";
import MyAnswers from "./pages/MyAnswers";
import Notifications from "./pages/Notifications";
import Maintenance from "./pages/Maintenance";
import JsonParser from "./pages/JsonParser";
import AdminFeedback from "./pages/AdminFeedback";
import UserProfile from "./pages/UserProfile";
import AdvancedSearch from "./pages/AdvancedSearch";
import TimedChallenge from "./pages/TimedChallenge";
import APIDocumentation from "./pages/APIDocumentation";
import Recommendations from "./pages/Recommendations";
import CategoryRoadmap from "./pages/CategoryRoadmap";
import ExportData from "./pages/ExportData";
import AdvancedStudyHub from "./pages/AdvancedStudyHub";
import MyFeedback from "./pages/MyFeedback";
import DevTools from "./pages/DevTools";
import AdminTasks from "./pages/AdminTasks";
import MyTasks from "./pages/MyTasks";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GuestBanner />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar — desktop */}
          <div className="hidden md:flex items-center justify-end gap-2 px-8 py-3 sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur border-b border-black/5 dark:border-white/8">
            <GlobalSearch />
            <NotificationBell />
            <UserMenu />
          </div>
          {/* Top bar — mobile */}
          <div className="md:hidden flex items-center justify-between px-4 py-2.5 sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-black/5 dark:border-white/8">
            <div className="flex items-center gap-2">
              <img
                src="/logo192.png"
                alt="DevQuiz"
                className="w-7 h-7 rounded-lg"
              />
              <span className="font-bold text-sm gradient-text">DevQuiz</span>
            </div>
            <GlobalSearch />
          </div>
          <main className="flex-1 p-4 md:p-6 pb-28 md:pb-8 max-w-4xl mx-auto w-full">
            {children}
          </main>
        </div>
        <BottomNav />
        <ScrollToTopBtn />
      </div>
    </div>
  );
}

function ProtectedPage({ children, path }) {
  return (
    <ProtectedRoute path={path}>
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
    const conditions = ["sunny", "cloudy", "foggy", "rainy", "snowy", "stormy"];
    conditions.forEach((c) => html.classList.remove(`weather-${c}`));
    if (activeCondition) html.classList.add(`weather-${activeCondition}`);
    return () =>
      conditions.forEach((c) => html.classList.remove(`weather-${c}`));
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

function playNotificationSound() {
  try {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  } catch {}
}

function AppInner() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [appConfig, setAppConfig] = useState({
    maintenance: false,
    force_update: false,
  });
  const [updateDismissed, setUpdateDismissed] = useState(() => {
    try {
      return localStorage.getItem("devquiz_update_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Performance optimization: disable weather effects during maintenance or force update
  const isMaintenanceOrUpdate = appConfig.maintenance || appConfig.force_update;

  useEffect(() => {
    api
      .get("/admin/app-config/public")
      .then(({ data }) => setAppConfig(data))
      .catch(() => {});
  }, []);

  const handleDismissUpdate = () => {
    localStorage.setItem("devquiz_update_dismissed", "true");
    setUpdateDismissed(true);
  };

  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

  // Maintenance mode — block everyone except admins
  if (appConfig.maintenance && !isAdmin) {
    return <Maintenance message={appConfig.maintenance_message} />;
  }

  // Show foreground FCM notifications as a toast (browser doesn't show them automatically when app is open)
  useEffect(() => {
    if (!user) return;

    // Listen for PLAY_NOTIFICATION_SOUND from the service worker (background push while tab is open)
    const swHandler = (event) => {
      if (event.data?.type === "PLAY_NOTIFICATION_SOUND")
        playNotificationSound();
    };
    navigator.serviceWorker?.addEventListener("message", swHandler);

    const unsub = onForegroundMessage(({ notification, data }) => {
      const title = notification?.title ?? "DevQuiz";
      const body = notification?.body ?? "";
      playNotificationSound();
      toast(
        <div className="flex items-start gap-2">
          <img
            src="/logo192.png"
            className="w-8 h-8 rounded-lg flex-shrink-0"
            alt=""
          />
          <div>
            <p className="font-semibold text-sm">{title}</p>
            {body && <p className="text-xs opacity-80 mt-0.5">{body}</p>}
          </div>
        </div>,
        { duration: 6000, style: { padding: "10px 14px" } },
      );
    });
    return () => {
      unsub?.();
      navigator.serviceWorker?.removeEventListener("message", swHandler);
    };
  }, [user]);

  const toastStyle =
    theme === "dark"
      ? {
          background: "#1e293b",
          color: "#f1f5f9",
          border: "1px solid rgba(255,255,255,0.08)",
        }
      : {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid rgba(99,102,241,0.15)",
          boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
        };

  return (
    <>
      {/* Disable weather effects during maintenance to save performance */}
      {!isMaintenanceOrUpdate && <WeatherEffects />}
      <NotificationBanner />
      {/* Force update banner — optimized for performance */}
      {user &&
        !user.isGuest &&
        appConfig.force_update &&
        !isAdmin &&
        !updateDismissed && (
          <div className="fixed top-0 inset-x-0 z-[9998] bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>🚀</span>
              <span>
                {appConfig.force_update_message ||
                  "A new version is available!"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Detect mobile and show APK download */}
              {/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                <>
                  <a
                    href="https://ai-devquiz.netlify.app/devquiz.apk"
                    className="text-xs bg-white text-indigo-600 font-bold px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors whitespace-nowrap"
                    download="devquiz.apk"
                  >
                    📱 Download APK
                  </a>
                  <button
                    onClick={handleDismissUpdate}
                    className="text-white/70 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs bg-white text-indigo-600 font-bold px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors whitespace-nowrap"
                  >
                    🔄 Refresh Now
                  </button>
                  <button
                    onClick={handleDismissUpdate}
                    className="text-white/70 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      <Toaster
        position="top-right"
        containerStyle={{
          top: 60,
          right: 20,
        }}
        toastOptions={{ style: { ...toastStyle, borderRadius: "12px" } }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            user && !user.isGuest ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            user && !user.isGuest ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedPage path="/dashboard">
              <Dashboard />
            </ProtectedPage>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedPage path="/generate">
              <Generator />
            </ProtectedPage>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedPage path="/community">
              <Community />
            </ProtectedPage>
          }
        />
        <Route
          path="/my-questions"
          element={
            <ProtectedPage path="/my-questions">
              <MyQuestions />
            </ProtectedPage>
          }
        />
        <Route
          path="/drafts"
          element={
            <ProtectedPage path="/drafts">
              <Drafts />
            </ProtectedPage>
          }
        />
        <Route
          path="/ask"
          element={
            <ProtectedPage path="/ask">
              <AskAI />
            </ProtectedPage>
          }
        />
        <Route
          path="/my-answers"
          element={
            <ProtectedPage path="/my-answers">
              <MyAnswers />
            </ProtectedPage>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedPage path="/notifications">
              <Notifications />
            </ProtectedPage>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedPage path="/bookmarks">
              <Bookmarks />
            </ProtectedPage>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedPage path="/leaderboard">
              <Leaderboard />
            </ProtectedPage>
          }
        />
        <Route
          path="/guide"
          element={
            <ProtectedPage path="/guide">
              <ProjectGuide />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedPage path="/admin">
              <Admin />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedPage path="/admin/feedback">
              <AdminFeedback />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <ProtectedPage path="/admin/tasks">
              <AdminTasks />
            </ProtectedPage>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <ProtectedPage path="/my-tasks">
              <MyTasks />
            </ProtectedPage>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedPage path="/quiz">
              <Quiz />
            </ProtectedPage>
          }
        />
        <Route
          path="/study"
          element={
            <ProtectedPage path="/study">
              <StudyGuide />
            </ProtectedPage>
          }
        />
        <Route
          path="/devtools"
          element={
            <ProtectedPage path="/devtools">
              <DevTools />
            </ProtectedPage>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedPage path="/mock-interview">
              <MockInterview />
            </ProtectedPage>
          }
        />
        <Route
          path="/flashcards"
          element={
            <ProtectedPage path="/flashcards">
              <Flashcards />
            </ProtectedPage>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedPage path="/progress">
              <Progress />
            </ProtectedPage>
          }
        />
        <Route
          path="/question/:id"
          element={
            <ProtectedPage path="/question">
              <QuestionDetail />
            </ProtectedPage>
          }
        />
        <Route
          path="/js-compiler"
          element={
            <ProtectedPage path="/js-compiler">
              <JsCompiler />
            </ProtectedPage>
          }
        />
        <Route
          path="/json-parser"
          element={
            <ProtectedPage path="/json-parser">
              <JsonParser />
            </ProtectedPage>
          }
        />
        <Route
          path="/challenge"
          element={
            <ProtectedPage path="/challenge">
              <JSChallenge />
            </ProtectedPage>
          }
        />
        <Route
          path="/workboard"
          element={
            <ProtectedPage path="/workboard">
              <WorkBoard />
            </ProtectedPage>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedPage path="/profile">
              <UserProfile />
            </ProtectedPage>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedPage path="/profile">
              <UserProfile />
            </ProtectedPage>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedPage path="/search">
              <AdvancedSearch />
            </ProtectedPage>
          }
        />
        <Route
          path="/timed-challenge"
          element={
            <ProtectedPage path="/timed-challenge">
              <TimedChallenge />
            </ProtectedPage>
          }
        />
        <Route
          path="/api-docs"
          element={
            <ProtectedPage path="/api-docs">
              <APIDocumentation />
            </ProtectedPage>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedPage path="/recommendations">
              <Recommendations />
            </ProtectedPage>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedPage path="/roadmap">
              <CategoryRoadmap />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/export"
          element={
            <ProtectedPage path="/admin/export">
              <ExportData />
            </ProtectedPage>
          }
        />
        <Route
          path="/study-advanced"
          element={
            <ProtectedPage path="/study-advanced">
              <AdvancedStudyHub />
            </ProtectedPage>
          }
        />
        <Route
          path="/my-feedback"
          element={
            <ProtectedPage path="/my-feedback">
              <MyFeedback />
            </ProtectedPage>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>

      {/* Feedback modal */}
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* Floating feedback button — hidden for admins (they manage feedback, not submit it) */}
      {user &&
        !user.isGuest &&
        user.role !== "admin" &&
        user.role !== "sub_admin" && (
          <motion.button
            onClick={() => setFeedbackOpen(true)}
            className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Send feedback"
          >
            💭
          </motion.button>
        )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <WeatherProvider>
        <AppInner />
      </WeatherProvider>
    </ErrorBoundary>
  );
}
