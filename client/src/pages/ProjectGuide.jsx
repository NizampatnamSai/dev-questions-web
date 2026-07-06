import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { STUDY_TOPICS, STUDY_CATEGORIES } from "../data/studyGuide";

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
    summary: `${STUDY_TOPICS.length}+ topics across ${STUDY_CATEGORIES.length} technologies — HTML, CSS, JS, TypeScript, React, React Native, Next.js, Web Security, System Design, DevOps, and more — with progress tracking.`,
    steps: [
      "Go to **Study Hub** — pick a category tab (HTML, CSS, JavaScript, TypeScript, React, React Native, Next.js, Git, Python, and more).",
      "Filter by difficulty — Basic, Intermediate, Advanced, or Tricky.",
      "Click a topic card to expand it and read the explanation, code example, and interview question.",
      "Click **Mark Reviewed** once you've gone through a topic — it's saved to your account when logged in, or to your device if you're a guest.",
      "Use the **source links** (W3Schools, MDN) for official docs, or open the AI panel for a deeper explanation.",
    ],
    tip: "If you're logged in, your reviewed progress syncs to your account automatically — including anything you reviewed as a guest before signing up.",
  },
  {
    icon: "💻",
    title: "JS Coding Questions",
    path: "/js-coding",
    color: "from-indigo-500 to-blue-500",
    summary: "AI-generated coding problems, graded against real test cases — not just an AI opinion.",
    steps: [
      "Go to **JS Coding** from the sidebar.",
      "Difficulty starts **Easy** and automatically ramps up as you solve more questions each day — drag the slider yourself to lock in a specific level instead.",
      "Click **✨ Generate Question** — read the problem, and check the **Test Cases** tab to see example inputs/outputs with a plain-English explanation of how each one works.",
      "Write your `solve(...)` function in the code editor and click **Run Tests** — each test case is actually executed in a sandbox, not guessed by AI.",
      "Once you've submitted, click **🤖 Reveal AI Answer** to compare your solution.",
      "Use **📜 History** to revisit past questions and **← Back to History** to return to the list.",
    ],
    tip: "Admins can grant themselves quick +5/+10/+15 daily question bonuses right from the page, without needing the Admin Panel.",
  },
  {
    icon: "📋",
    title: "My Tasks",
    path: "/my-tasks",
    color: "from-slate-500 to-slate-700",
    summary: "Track tasks assigned to you through a Jira-style workflow.",
    steps: [
      "Go to **My Tasks** — tasks are organized into four columns: **To Do**, **Started**, **Testing**, and **Completed**.",
      "Click a status pill on a task card to move it forward one stage at a time — you can always move a task backward if it needs more work.",
      "Only an admin can mark a task **Completed** — once you believe it's ready, move it to **Testing** and leave a comment so they know to review it.",
      "Click **▼ Discussion** on a task to open a comment thread with your admin.",
      "Click a task's title to see the full description and due date.",
    ],
    tip: "If you think a task is done but can't mark it completed yourself, that's expected — add a comment and your admin will confirm it.",
  },
  {
    icon: "📋",
    title: "Task Manager",
    path: "/admin/tasks",
    color: "from-purple-500 to-indigo-600",
    summary: "Admin-only — assign, track, and manage tasks across the team.",
    steps: [
      "Open **Task Manager** from the sidebar (visible to admins only).",
      "Click **+ New Task** — set a title, description (rich text supported), priority, due date, and assignees.",
      "Tasks appear on a 4-column kanban board (**To Do / Started / Testing / Completed**) — click any status pill to move a task, including straight to Completed.",
      "Click **👁 View**, **💬**, **✏️**, or **🗑** on a card to view details, open comments, edit, or delete.",
      "Switch to the **Work Board** tab to approve join requests and change the daily reminder time or edit window.",
    ],
    tip: "Unlike regular users, admins can move a task to any stage — including marking it Completed directly.",
  },
  {
    icon: "📋",
    title: "Work Board",
    path: "/workboard",
    color: "from-teal-500 to-cyan-600",
    summary: "A daily standup feed — post what you're working on and see what the team is doing.",
    steps: [
      "Request to join from the **Work Board** page — an admin approves new members.",
      "Once approved, post your daily update — you get a short editing window (default 30 minutes) to fix typos.",
      "After the edit window closes, click **Reply** on your own post to add a follow-up update instead of overwriting the original — handy if you picked up new work later in the day.",
      "Anyone who hasn't posted by the reminder time (default 3 PM IST) gets a push notification.",
      "Browse **📅 History** to see past days' posts.",
    ],
    tip: "Once your edit window closes, you can't rewrite your original post — but you can always reply to add updates as the day goes on.",
  },
  {
    icon: "🛠️",
    title: "Dev Tools",
    path: "/regex-tester",
    color: "from-fuchsia-500 to-purple-600",
    summary: "Five everyday developer utilities, built right into DevQuiz.",
    steps: [
      "**Regex Tester** (`/regex-tester`) — live match highlighting, capture groups, and a replace mode, with common presets for email/URL/IPv4 and more.",
      "**Cron Builder** (`/cron-builder`) — build a schedule field by field, get a plain-English description, and preview the next 5 run times.",
      "**JWT Decoder** (`/jwt-decoder`) — decode a token's header and payload entirely in your browser, with optional HMAC signature verification.",
      "**API Request Tester** (`/api-tester`) — send real requests (raw JSON, form data, or x-www-form-urlencoded) with a Bearer Token auth tab, proxied server-side to avoid CORS.",
      "**Snippet Library** (`/snippets`) — save reusable code snippets with tags and a description, and optionally share them publicly with the whole team.",
    ],
    tip: "Regex Tester, Cron Builder, and JWT Decoder don't require login — they're available to guests too, since nothing is saved.",
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
  {
    icon: "📝",
    title: "Notes",
    path: "/notes",
    color: "from-slate-500 to-slate-700",
    summary: "Personal notes, encrypted end-to-end — not even an admin can read them.",
    steps: [
      "Open **Notes** from the sidebar and set a passphrase the first time — this is separate from your account password and can't be reset if forgotten.",
      "Everything is encrypted and decrypted only in your browser; the server only ever stores unreadable ciphertext.",
      "Check **Don't ask again this session** to skip re-entering your passphrase on this browser tab until you log out — a confirmation warns you what that trades off first.",
      "Use the **Blur** dropdown at the top to blur note previews (all, title only, or description only) for privacy — hover a card to reveal it.",
      "Use **⬇ Export CSV** to download your notes for a date range.",
    ],
    tip: "There is no admin override or master key by design — if you forget your passphrase, your notes are unrecoverable, so store it somewhere safe.",
  },
  {
    icon: "🤖",
    title: "Ask AI",
    path: "/ask",
    color: "from-cyan-500 to-blue-500",
    summary: "A general-purpose AI chat, plus Prompt Improver, Image, Create, and Humanize modes.",
    steps: [
      "Open **Ask AI** and type any question — Python internals, how a concept works, debugging help.",
      "Switch to **✨ Prompt Improver** mode (top right) when you want a clean, detailed prompt to paste into ChatGPT, Claude, or any other AI instead of an answer here.",
      "In Prompt Improver mode, describe your goal in plain words (e.g. 'give me a prompt for ChatGPT to create a React website') and it writes the full prompt for you.",
      "Switch to **🧑 Humanize** mode and paste any AI-generated text (up to 1000 words) — it rewrites it to sound more natural, keeping the same meaning and length.",
      "Use **📋 Copy response** on any AI message to copy it.",
      "Turn on **Auto-save** to keep every conversation, or save manually — past chats live in the sidebar.",
    ],
    tip: "For DevQuiz-specific questions (how a feature here works, where to find something), use the 🤖 chatbot icon in the top bar instead — Ask AI is for general questions.",
  },
  {
    icon: "📹",
    title: "Meetings",
    path: "/meetings",
    color: "from-red-500 to-pink-500",
    summary: "Free video calls — admins schedule them, anyone with a join code can join even without an account.",
    steps: [
      "Admins: open **Meetings**, click **+ New Meeting**, give it a title, optionally schedule it for later, and pick who to invite.",
      "Admins: the first person to join a meeting must sign in once via Google/GitHub on Jitsi's own screen to become the host — that's Jitsi's free-tier policy, not something we control. Everyone joining after that needs no login at all.",
      "Everyone: use the **🔑 join code** shown on the meeting (admins can copy it) to join directly, even as a guest with no account.",
      "During a call, use **—** to minimize it to a small window so you can keep using the rest of the site, and **Leave** to exit.",
      "Admins: use **End Meeting** to end the call for everyone at once.",
    ],
    tip: "The join code works for anyone, invited or not — only share it with people you actually want in the call.",
  },
  {
    icon: "💬",
    title: "Messages",
    path: "/messages",
    color: "from-indigo-500 to-purple-500",
    summary: "Private 1-to-1 chat with an admin — only an admin can start a conversation, but once one exists you can reply freely.",
    steps: [
      "Admins: open **Messages**, click **+**, and pick any user to start a private conversation.",
      "Everyone: reply with rich text (bold, lists, links) or attach an image, right from the conversation.",
      "Toggle **🙈 Blur** to hide message content on screen until you hover — handy in shared spaces, same idea as Notes.",
      "You'll get a push + in-app notification for every new message, even while you're on another page.",
    ],
    tip: "Regular users can't start new conversations or message each other — only an admin can open the first message.",
  },
  /* Recent Jobs disabled for now
  {
    icon: "💼",
    title: "Recent Jobs",
    path: "/jobs",
    color: "from-emerald-500 to-teal-500",
    summary: "Real, live tech job listings from the last 7 days.",
    steps: [
      "Open **Recent Jobs** from the sidebar — no setup needed.",
      "Search by title, company, or tag, or toggle **🌍 Remote only**.",
      "Click any listing to open the real posting on the source site.",
    ],
    tip: "Listings currently skew Germany/Europe-focused since that's what the free data source covers — broader regional coverage is on the list for later.",
  },
  */
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
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
              {["17 Features", "Step-by-step", "Tips included"].map(badge => (
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
