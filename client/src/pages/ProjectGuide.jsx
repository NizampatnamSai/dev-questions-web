import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: "📊",
    title: "Dashboard",
    path: "/dashboard",
    color: "from-blue-500 to-indigo-500",
    summary: "Your home base — see your stats and jump into action.",
    steps: [
      "After logging in you land on the Dashboard automatically.",
      "View your total questions, categories covered, and community posts at a glance.",
      "Click **✨ Quick Generate** to instantly create an AI question without leaving the page.",
      "Scroll down to see your questions broken down by category, level, and type.",
    ],
    tip: "Check your dashboard daily to track how many categories you've touched.",
  },
  {
    icon: "✨",
    title: "AI Generator",
    path: "/generate",
    color: "from-purple-500 to-pink-500",
    summary: "Generate interview questions using AI in seconds.",
    steps: [
      "Go to **AI Generator** from the sidebar.",
      "Pick a **Category** (JavaScript, React, Node.js, etc.), **Level** (Low / Medium / High), and **Type** (Technical / Coding / Conceptual).",
      "Optionally type a custom topic in the text box (e.g. 'React hooks').",
      "Click **Generate Question** — the AI creates a question + detailed answer.",
      "Hit **Save to My Questions** to keep it, or **Generate Again** for a different one.",
    ],
    tip: "You have a daily post limit. The usage bar at the top shows how many you've used today.",
  },
  {
    icon: "🧠",
    title: "Quiz Mode",
    path: "/quiz",
    color: "from-amber-500 to-orange-500",
    summary: "Test yourself with real interview questions.",
    steps: [
      "Open **Quiz Mode** from the sidebar.",
      "Choose filters: category, difficulty level, and question type.",
      "Click **Start Quiz** — questions appear one at a time.",
      "Read the question, think of your answer, then click **Show Answer** to reveal it.",
      "Mark yourself **Got it ✓** or **Missed ✗** — your score is tracked live.",
      "At the end you see your score breakdown and can restart or change filters.",
    ],
    tip: "Quiz Mode only shows questions posted by the community — the more questions people save, the better your quiz pool.",
  },
  {
    icon: "📚",
    title: "Study Hub",
    path: "/study",
    color: "from-green-500 to-teal-500",
    summary: "Structured study guides, external resources, and built-in dev tools.",
    steps: [
      "Go to **Study Hub** — you'll see topic cards: HTML, CSS, JavaScript, React, etc.",
      "Click a topic to expand it — it shows your progress bar and a list of concepts.",
      "Click any concept to get an AI explanation right inside the app.",
      "Use the **source links** (W3Schools, MDN) below the progress bar for official docs.",
      "Scroll down to find the **Dev Tools** panel with 4 built-in tools.",
    ],
    tip: null,
    subSteps: {
      title: "Dev Tools inside Study Hub",
      items: [
        "**TypeScript Adder** — paste any JS code and AI adds full TypeScript types.",
        "**Error Finder** — paste code and AI finds bugs and syntax errors.",
        "**Break Finder** — AI spots runtime risks and edge cases in your code.",
        "**JS Compiler** — run JavaScript code right in the browser. Also available at `/js-compiler` as a full page.",
      ],
    },
  },
  {
    icon: "🎯",
    title: "Mock Interview",
    path: "/mock-interview",
    color: "from-red-500 to-rose-500",
    summary: "Simulate a real interview with AI asking you questions.",
    steps: [
      "Open **Mock Interview** from the sidebar.",
      "Select a role (Frontend, Backend, Fullstack, etc.) and difficulty.",
      "Click **Start Interview** — the AI acts as an interviewer.",
      "Answer each question by typing your response and pressing **Submit**.",
      "The AI gives feedback on each answer and moves to the next question.",
      "At the end you get an overall score and improvement tips.",
    ],
    tip: "Try to answer as if it's a real interview — don't look things up. The AI grades you on completeness and accuracy.",
  },
  {
    icon: "🃏",
    title: "Flashcards",
    path: "/flashcards",
    color: "from-cyan-500 to-blue-500",
    summary: "Flip through concept cards to memorize key topics.",
    steps: [
      "Go to **Flashcards** from the sidebar.",
      "Pick a category from the tabs at the top.",
      "Each card shows a concept on the front — click it to flip and see the explanation.",
      "Use the **← →** arrows or swipe to move between cards.",
      "Cards you've seen are tracked so you can pick up where you left off.",
    ],
    tip: "Do a flashcard round before bed — spaced repetition works best when reviewed before sleep.",
  },
  {
    icon: "📈",
    title: "My Progress",
    path: "/progress",
    color: "from-violet-500 to-purple-500",
    summary: "See how you're improving over time.",
    steps: [
      "Open **My Progress** from the sidebar.",
      "View your **Overall Readiness** score — calculated from quiz results.",
      "See score breakdowns by category to spot your weak areas.",
      "The history chart shows your quiz scores over time.",
      "Focus on categories with the lowest bars first.",
    ],
    tip: "Take a quiz after every study session so your progress score stays accurate.",
  },
  {
    icon: "🌍",
    title: "Community",
    path: "/community",
    color: "from-emerald-500 to-green-500",
    summary: "Browse, upvote, and save questions posted by everyone.",
    steps: [
      "Go to **Community** from the sidebar.",
      "Browse all questions posted by you and other users.",
      "Click **▲ Upvote** on questions you find helpful.",
      "Click **🔖 Bookmark** to save a question to your Bookmarks.",
      "Click any question title to open its full detail page with answers and comments.",
      "Use the filter bar to search by category, level, or keyword.",
    ],
    tip: "Questions with more upvotes appear in Quiz Mode more often — upvote quality questions.",
  },
  {
    icon: "📝",
    title: "My Questions",
    path: "/my-questions",
    color: "from-orange-500 to-amber-500",
    summary: "Manage all the questions you've created or saved.",
    steps: [
      "Go to **My Questions** from the sidebar.",
      "See all questions you've generated with AI or saved manually.",
      "Click **✏️ Edit** to update the question text or answer.",
      "Click **🗑 Delete** → confirm in the modal to remove it permanently.",
      "Use the **Load more** button to see older questions.",
    ],
    tip: "Editing a question improves the community pool — fix any AI mistakes before they reach other users.",
  },
  {
    icon: "🔖",
    title: "Bookmarks",
    path: "/bookmarks",
    color: "from-pink-500 to-rose-500",
    summary: "Quick access to questions you've saved for later.",
    steps: [
      "Go to **Bookmarks** from the sidebar.",
      "All questions you bookmarked from Community appear here.",
      "Click **🔖 Saved** on any card to un-bookmark and remove it from this list.",
      "Use bookmarks as a personal revision list before an interview.",
    ],
    tip: "Bookmark tough questions you got wrong in Quiz Mode and revisit them here.",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    path: "/leaderboard",
    color: "from-yellow-500 to-orange-500",
    summary: "See who's contributed the most to the community.",
    steps: [
      "Open **Leaderboard** from the sidebar.",
      "Users are ranked by total questions posted.",
      "The bars show questions posted (indigo) and upvotes received (cyan).",
      "🥇🥈🥉 medals go to the top 3 contributors.",
      "Climb the board by generating and saving more quality questions.",
    ],
    tip: "The leaderboard resets... never — your contributions are permanent 🏅",
  },
  {
    icon: "🔔",
    title: "Push Notifications",
    path: null,
    color: "from-indigo-500 to-violet-500",
    summary: "Get weekly reminders to keep your streak alive.",
    steps: [
      "When you first log in, the app asks for notification permission — click **Allow**.",
      "If you missed it, go to your browser settings and enable notifications for this site.",
      "An admin schedules weekly reminders for each user (e.g. every Monday at 10 AM IST).",
      "You'll get a push notification on your phone or browser at the scheduled time.",
      "Notifications arrive even when the app isn't open (as long as the browser is running).",
    ],
    tip: "On mobile, install the app as a PWA for the best notification experience.",
  },
];

function FeatureCard({ feature, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
      >
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
          {feature.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 dark:text-slate-100">{feature.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{feature.summary}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {feature.path && (
            <Link
              to={feature.path}
              onClick={e => e.stopPropagation()}
              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors font-medium"
            >
              Open →
            </Link>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 text-lg leading-none"
          >
            ▾
          </motion.span>
        </div>
      </button>

      {/* Expanded steps */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-black/5 dark:border-white/10 pt-4">
              {/* Steps */}
              <ol className="space-y-2.5">
                {feature.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: step.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-800 dark:text-slate-100">$1</strong>')
                      }}
                    />
                  </li>
                ))}
              </ol>

              {/* Sub-steps (Dev Tools) */}
              {feature.subSteps && (
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{feature.subSteps.title}</p>
                  <ul className="space-y-1.5">
                    {feature.subSteps.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{
                          __html: item.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-800 dark:text-slate-100">$1</strong>')
                        }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tip */}
              {feature.tip && (
                <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-3.5">
                  <span className="text-lg flex-shrink-0">💡</span>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{feature.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectGuide() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const filtered = FEATURES.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      {/* Hero */}
      <div className="glass-card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🗺️</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Project Guide</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Everything you need to know to get the most out of DevQuiz — step by step.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["12 Features", "Step-by-step", "Tips included"].map(badge => (
                <span key={badge} className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search features…"
        className="input-light w-full"
      />

      {/* Feature cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-8">No features match "{search}"</p>
        ) : (
          filtered.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)
        )}
      </div>

      {/* Footer CTA — hidden for guests */}
      {!user?.isGuest && (
        <div className="glass-card p-5 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ready to start?</p>
          <p className="text-xs text-slate-400">Jump into the AI Generator and create your first question</p>
          <Link to="/generate" className="inline-block mt-1 btn-primary px-6 py-2 text-sm rounded-xl">
            ✨ Start Generating
          </Link>
        </div>
      )}
    </motion.div>
  );
}
