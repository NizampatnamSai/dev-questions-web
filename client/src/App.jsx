import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
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
import ZoomControl from "./components/ZoomControl";
import BrightnessControl from "./components/BrightnessControl";
import Footer from "./components/Footer";
import ProjectChatbot from "./components/ProjectChatbot";
// Not lazy: these are synchronous full-screen gates rendered as an early
// return from AppInner, outside the <Suspense> that wraps <Routes>. If they
// were lazy and their chunk hadn't loaded yet, the first suspend would have
// no boundary above it to catch it (blank/crashed screen) — exactly the
// wrong failure mode for a maintenance/lockout page.
import Maintenance from "./pages/Maintenance";
import GuestModeDisabled from "./pages/GuestModeDisabled";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { WeatherProvider, useWeather } from "./context/WeatherContext";
import { requestAndRegisterToken, onForegroundMessage } from "./firebase";
import api from "./api/axios";
import { getPageTitle } from "./utils/pageTitle";

// Every page is code-split via React.lazy() — previously all 47 pages were
// bundled into one ~3.4MB JS file downloaded and parsed on every single page
// load, which is the real cause of "site feels laggy," especially on first
// load and on slower connections. Now each page is its own chunk, fetched
// only when a user actually navigates to it.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Generator = lazy(() => import("./pages/Generator"));
const Community = lazy(() => import("./pages/Community"));
const MyQuestions = lazy(() => import("./pages/MyQuestions"));
const Drafts = lazy(() => import("./pages/Drafts"));
const AskAI = lazy(() => import("./pages/AskAI"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Quiz = lazy(() => import("./pages/Quiz"));
const QuestionDetail = lazy(() => import("./pages/QuestionDetail"));
const StudyGuide = lazy(() => import("./pages/StudyGuide"));
const IbpsPoPrep = lazy(() => import("./pages/IbpsPoPrep"));
const MockInterview = lazy(() => import("./pages/MockInterview"));
const TypingRace = lazy(() => import("./pages/TypingRace"));
const MiniSudoku = lazy(() => import("./pages/MiniSudoku"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const Progress = lazy(() => import("./pages/Progress"));
const JsCompiler = lazy(() => import("./pages/JsCompiler"));
const TsCompiler = lazy(() => import("./pages/TsCompiler"));
const ProjectGuide = lazy(() => import("./pages/ProjectGuide"));
const JSChallenge = lazy(() => import("./pages/JSChallenge"));
const JsCodingQuestions = lazy(() => import("./pages/JsCodingQuestions"));
const ResumeAnalyzer = lazy(() => import("./pages/ResumeAnalyzer"));
const BackgroundRemover = lazy(() => import("./pages/BackgroundRemover"));
const Notes = lazy(() => import("./pages/Notes"));
const WorkBoard = lazy(() => import("./pages/WorkBoard"));
const MyAnswers = lazy(() => import("./pages/MyAnswers"));
const Notifications = lazy(() => import("./pages/Notifications"));
const JsonParser = lazy(() => import("./pages/JsonParser"));
const RegexTester = lazy(() => import("./pages/RegexTester"));
const CronBuilder = lazy(() => import("./pages/CronBuilder"));
const JwtDecoder = lazy(() => import("./pages/JwtDecoder"));
const ApiTester = lazy(() => import("./pages/ApiTester"));
const SnippetLibrary = lazy(() => import("./pages/SnippetLibrary"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const TimedChallenge = lazy(() => import("./pages/TimedChallenge"));
const APIDocumentation = lazy(() => import("./pages/APIDocumentation"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const CategoryRoadmap = lazy(() => import("./pages/CategoryRoadmap"));
const ExportData = lazy(() => import("./pages/ExportData"));
const AdvancedStudyHub = lazy(() => import("./pages/AdvancedStudyHub"));
const MyFeedback = lazy(() => import("./pages/MyFeedback"));
const DevTools = lazy(() => import("./pages/DevTools"));
const AdminTasks = lazy(() => import("./pages/AdminTasks"));
const AdminFeaturesDoc = lazy(() => import("./pages/AdminFeaturesDoc"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Meetings = lazy(() => import("./pages/Meetings"));
const AdminChat = lazy(() => import("./pages/AdminChat"));
const MyTasks = lazy(() => import("./pages/MyTasks"));

// Kept short and subtle on purpose: this wraps every single page, and the
// old 250ms fade+12px slide was long enough that scrolling immediately after
// clicking a nav link (very natural for a fast user) caught whatever just
// scrolled into view still mid-fade-in — reading as a blank flash before the
// content "popped in". A much shorter, smaller-offset transition keeps the
// visual continuity without being catchable by an immediate scroll.
const pageVariants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

function PageWrapper({ children, fillHeight = false }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      // Only a flex item/container when the page needs it (Ask AI,
      // Messages) — display:flex changes margin-collapsing behavior, so
      // this stays a no-op div for every other page rather than applying
      // globally and risking subtle layout shifts across the whole app.
      className={fillHeight ? "flex-1 flex flex-col min-h-0" : undefined}
    >
      {children}
    </motion.div>
  );
}

function AppLayout({ children, fullWidth = false, hideFooter = false }) {
  const [sidebarHidden, setSidebarHidden] = useState(() => {
    try {
      return localStorage.getItem("devquiz_sidebar_hidden") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarHidden((v) => {
      const next = !v;
      try {
        localStorage.setItem("devquiz_sidebar_hidden", String(next));
      } catch { /* ignore */ }
      return next;
    });
  };

  // hideFooter pages (Ask AI, Messages) are chat-style UIs that size their
  // own message list to fill exactly the space left after the chrome above
  // them — previously via `calc(100vh - Nrem)` with a hand-guessed rem
  // value that never quite matched the real topbar+padding height, causing
  // the OUTER page to also need a scroll just to reveal a few px of extra
  // content. Real fix: make the whole shell a fixed h-screen box for these
  // pages (min-h-0 at every flex level so children can actually shrink —
  // the classic flexbox gotcha) so the page itself can never overflow, and
  // let the page's own content fill via h-full/flex-1 with zero magic
  // numbers, instead of both fighting over the same viewport height.
  const shellClass = hideFooter ? "flex h-screen flex-col overflow-hidden" : "flex min-h-screen flex-col";
  const innerRowClass = hideFooter ? "flex flex-1 min-h-0" : "flex flex-1";
  const contentColClass = hideFooter ? "flex-1 flex flex-col min-w-0 min-h-0" : "flex-1 flex flex-col min-w-0";
  // BottomNav is `fixed bottom-0` + md:hidden — on mobile it overlays
  // whatever's beneath it. Normal pages get clearance from `pb-28` since
  // they scroll normally and eventually reveal that padding; this fixed
  // h-screen shell doesn't scroll at the page level at all, so without an
  // explicit bottom inset here the chat's own last message / input row
  // renders (and stays) hidden behind the nav bar instead of just needing
  // a scroll to reach it.
  const mainClass = hideFooter
    ? "flex-1 min-h-0 flex flex-col p-4 md:p-6 pb-20 md:pb-6 mx-auto w-full max-w-full overflow-hidden"
    : "flex-1 p-4 md:p-6 pb-28 md:pb-8 mx-auto w-full max-w-full";

  return (
    <div className={shellClass}>
      <GuestBanner />
      <div className={innerRowClass}>
        {!sidebarHidden && (
          <div className="hidden md:block flex-shrink-0 w-64">
            <Sidebar />
          </div>
        )}
        <div className={contentColClass}>
          {/* Top bar — desktop */}
          <div className="hidden md:flex items-center justify-between gap-2 px-4 py-3 sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 border-b border-black/5 dark:border-white/8">
            <button
              onClick={toggleSidebar}
              title={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {sidebarHidden ? "☰" : "◀"}
            </button>
            <div className="flex items-center gap-2">
              <ZoomControl />
              <BrightnessControl />
              <GlobalSearch />
              <ProjectChatbot />
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
          {/* Top bar — mobile */}
          <div className="md:hidden flex items-center justify-between px-4 py-2.5 sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-black/5 dark:border-white/8">
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <img
                  src="/logo192.png"
                  alt="Dev Life"
                  className="w-7 h-7 rounded-lg"
                />
                <span className="absolute -bottom-1 -right-1 text-[6px] font-extrabold leading-none px-1 py-0.5 rounded-full bg-indigo-600 text-white border border-white dark:border-slate-950 shadow-sm">
                  AI
                </span>
              </div>
              <span className="font-bold text-sm gradient-text flex items-center gap-1">
                Dev Life
                <span className="inline-flex items-center leading-none text-[8px] font-bold tracking-wide py-[3px] px-[4px] rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                  AI
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ProjectChatbot />
              <GlobalSearch />
            </div>
          </div>
          {/* Every page is full-width now — the old max-w-4xl default made most
              pages look cramped on real screens; `fullWidth` prop is kept as a
              no-op on call sites so nothing needs to change there. */}
          <main className={mainClass}>
            {children}
          </main>
          {/* Chat-style pages (Ask AI, Messages) size their own panel to
              calc(100vh - Nrem) so only the message list scrolls internally
              — rendering the Footer below that always pushed total page
              height past one viewport, forcing an outer page-level scroll
              just to reveal a few pixels of "Powered by…" text. Skipped on
              those pages instead of chasing an ever-more-precise offset. */}
          {!hideFooter && <Footer />}
        </div>
        <BottomNav />
        <ScrollToTopBtn />
      </div>
    </div>
  );
}

function ProtectedPage({ children, path, fullWidth = false, adminOnly = false, hideFooter = false }) {
  return (
    <ProtectedRoute path={path} adminOnly={adminOnly}>
      <AppLayout fullWidth={fullWidth} hideFooter={hideFooter}>
        <PageWrapper fillHeight={hideFooter}>{children}</PageWrapper>
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
      requestAndRegisterToken(api, user);
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
    guest_mode_enabled: true,
  });
  const [updateDismissed, setUpdateDismissed] = useState(() => {
    try {
      return localStorage.getItem("devquiz_update_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Performance optimization: disable weather effects during maintenance or force update
  const isMaintenanceOrUpdate = appConfig.maintenance || appConfig.force_update;

  // Re-checked on every navigation (not just once on first load) and on a
  // 30s poll — a tab that was already open when an admin flips maintenance/
  // guest-mode/force-update has no other way to find out. Fetching once on
  // mount meant an active guest session could keep browsing indefinitely
  // after guest mode was turned off, since nothing ever told that tab to
  // re-check until the user manually refreshed.
  useEffect(() => {
    api
      .get("/admin/app-config/public")
      .then(({ data }) => setAppConfig(data))
      .catch(() => {});
  }, [location.pathname]);

  // Report this build's version once per session so Admin's Force Update
  // panel can tell who's still running an old bundle after a deploy.
  const versionReported = useRef(false);
  useEffect(() => {
    if (!user || user.isGuest || versionReported.current) return;
    versionReported.current = true;
    api
      .post("/profile/my/app-version", { version: __APP_VERSION__ })
      .catch(() => {});
  }, [user]);

  // Sidebar's "locked page" prompt (guest mode) opens this same feedback
  // modal via a custom event instead of prop-drilling feedbackOpen down
  // through Sidebar — Sidebar has no other reason to know about it.
  useEffect(() => {
    const handler = () => setFeedbackOpen(true);
    window.addEventListener("open-feedback-modal", handler);
    return () => window.removeEventListener("open-feedback-modal", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      api
        .get("/admin/app-config/public")
        .then(({ data }) => setAppConfig(data))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleDismissUpdate = () => {
    localStorage.setItem("devquiz_update_dismissed", "true");
    setUpdateDismissed(true);
  };

  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

  // Show foreground FCM notifications as a toast (browser doesn't show them automatically when app is open).
  // Must stay ABOVE the early returns below — a hook called only on some
  // renders (e.g. skipped whenever the maintenance/guest-mode block kicks in)
  // violates the Rules of Hooks and crashes React with "Rendered fewer hooks
  // than expected." This is also why turning guest mode off didn't actually
  // block an active guest session: the crash prevented the block screen
  // from ever committing, so the app silently fell through to normal use.
  useEffect(() => {
    if (!user) return;

    // Listen for PLAY_NOTIFICATION_SOUND from the service worker (background push while tab is open)
    const swHandler = (event) => {
      if (event.data?.type === "PLAY_NOTIFICATION_SOUND")
        playNotificationSound();
    };
    navigator.serviceWorker?.addEventListener("message", swHandler);

    const unsub = onForegroundMessage(({ notification, data }) => {
      const title = notification?.title ?? "Dev Life";
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

  // Maintenance mode — block everyone except admins
  if (appConfig.maintenance && !isAdmin) {
    return <Maintenance message={appConfig.maintenance_message} />;
  }

  // Guest mode disabled — guests see nothing except this screen until they log in/register
  if (user?.isGuest && appConfig.guest_mode_enabled === false) {
    return <GuestModeDisabled message={appConfig.guest_mode_message} />;
  }

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
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <span className="w-8 h-8 border-2 border-indigo-400/40 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        }
      >
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
            <ProtectedPage path="/ask" fullWidth hideFooter>
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
            <ProtectedPage path="/admin" adminOnly>
              <Admin />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedPage path="/admin/feedback" adminOnly>
              <AdminFeedback />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <ProtectedPage path="/admin/tasks" fullWidth adminOnly>
              <AdminTasks />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/features-doc"
          element={
            <ProtectedPage path="/admin/features-doc" adminOnly>
              <AdminFeaturesDoc />
            </ProtectedPage>
          }
        />
        {/* /jobs route disabled for now
        <Route
          path="/jobs"
          element={
            <ProtectedPage path="/jobs">
              <Jobs />
            </ProtectedPage>
          }
        />
        */}
        <Route
          path="/meetings"
          element={
            <ProtectedPage path="/meetings">
              <Meetings />
            </ProtectedPage>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedPage path="/messages" hideFooter>
              <AdminChat />
            </ProtectedPage>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <ProtectedPage path="/my-tasks" fullWidth>
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
          path="/ibps-po"
          element={
            <ProtectedPage path="/ibps-po">
              <IbpsPoPrep />
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
          path="/typing-race"
          element={
            <ProtectedPage path="/typing-race">
              <TypingRace />
            </ProtectedPage>
          }
        />
        <Route
          path="/mini-sudoku"
          element={
            <ProtectedPage path="/mini-sudoku">
              <MiniSudoku />
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
          path="/ts-compiler"
          element={
            <ProtectedPage path="/ts-compiler">
              <TsCompiler />
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
          path="/regex-tester"
          element={
            <ProtectedPage path="/regex-tester">
              <RegexTester />
            </ProtectedPage>
          }
        />
        <Route
          path="/cron-builder"
          element={
            <ProtectedPage path="/cron-builder">
              <CronBuilder />
            </ProtectedPage>
          }
        />
        <Route
          path="/jwt-decoder"
          element={
            <ProtectedPage path="/jwt-decoder">
              <JwtDecoder />
            </ProtectedPage>
          }
        />
        <Route
          path="/api-tester"
          element={
            <ProtectedPage path="/api-tester" fullWidth>
              <ApiTester />
            </ProtectedPage>
          }
        />
        <Route
          path="/snippets"
          element={
            <ProtectedPage path="/snippets">
              <SnippetLibrary />
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
          path="/js-coding"
          element={
            <ProtectedPage path="/js-coding">
              <JsCodingQuestions />
            </ProtectedPage>
          }
        />
        <Route
          path="/resume-analyzer"
          element={
            <ProtectedPage path="/resume-analyzer">
              <ResumeAnalyzer />
            </ProtectedPage>
          }
        />
        <Route
          path="/background-remover"
          element={
            <ProtectedPage path="/background-remover">
              <BackgroundRemover />
            </ProtectedPage>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedPage path="/notes">
              <Notes />
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
            <ProtectedPage path="/api-docs" adminOnly>
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
            <ProtectedPage path="/admin/export" adminOnly>
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
      </Suspense>

      {/* Feedback modal */}
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        isGuest={user?.isGuest}
      />

      {/* Floating feedback button — hidden for admins (they manage feedback, not submit it).
          Guests only see it when the admin has guest feedback enabled. Pushed further up on
          /messages so it clears the composer's own send/attach buttons in that same corner
          instead of sitting on top of them. */}
      {user &&
        (!user.isGuest || appConfig.guest_feedback_enabled) &&
        user.role !== "admin" &&
        user.role !== "sub_admin" && (
          <motion.button
            onClick={() => setFeedbackOpen(true)}
            className={`fixed right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors ${
              location.pathname === "/messages" ? "bottom-40 md:bottom-24" : "bottom-24 md:bottom-6"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Send feedback"
          >
            💭
          </motion.button>
        )}

      {/* Floating Ask AI button — admin-only quick access, mirrors the user feedback button */}
      {user &&
        !user.isGuest &&
        (user.role === "admin" || user.role === "sub_admin") &&
        location.pathname !== "/ask" && (
          <motion.button
            onClick={() => navigate("/ask")}
            className={`fixed right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors ${
              location.pathname === "/messages" ? "bottom-40 md:bottom-24" : "bottom-24 md:bottom-6"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Ask AI"
          >
            🤖
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
