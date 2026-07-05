import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useClickOutside } from "../hooks/useClickOutside";

const GREETING = {
  role: "bot",
  text: "Hi! I'm the DevQuiz assistant — ask me about any feature or page, or tell me where you're trying to go and I'll take you there.",
  navigateTo: null,
};

const WAKE_WORD = "hey devquiz";
const SpeechRecognitionApi =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function ProjectChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem("devquiz_voice_wake") === "true");
  const [listeningForCommand, setListeningForCommand] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const wakeRecognitionRef = useRef(null);
  const commandRecognitionRef = useRef(null);
  const voiceEnabledRef = useRef(voiceEnabled);
  const restartWakeRef = useRef(null);

  useEffect(() => {
    // block: "nearest" keeps this scroll confined to the message list's own
    // scroll container — without it, scrollIntoView() can also nudge the
    // main page's scroll position slightly, which is what caused the whole
    // page to shift a little every time the panel opened.
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, open]);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    localStorage.setItem("devquiz_voice_wake", String(voiceEnabled));
  }, [voiceEnabled]);

  const send = async (overrideText, { fromVoice = false } = {}) => {
    const text = (overrideText ?? input).trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const { data } = await api.post("/project-chat/ask", { message: text });
      setMessages((m) => [...m, { role: "bot", text: data.reply, navigateTo: data.navigateTo }]);
      if (fromVoice && data.navigateTo) {
        setTimeout(() => goTo(data.navigateTo), 600);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setMessages((m) => [...m, { role: "bot", text: detail || "Sorry, something went wrong. Try again in a moment.", navigateTo: null }]);
    } finally {
      setSending(false);
    }
  };

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
    toast.success("Here you go!");
  };

  // Listens for a single command after the wake word fires, then feeds it
  // through the normal /project-chat/ask flow and auto-navigates on arrival —
  // unlike typed chat, a voice command shouldn't require a manual "Go there" tap.
  const listenForCommand = () => {
    if (!SpeechRecognitionApi) return;
    setOpen(true);
    setListeningForCommand(true);
    const rec = new SpeechRecognitionApi();
    commandRecognitionRef.current = rec;
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript?.trim();
      if (transcript) send(transcript, { fromVoice: true });
    };
    rec.onend = () => {
      setListeningForCommand(false);
      commandRecognitionRef.current = null;
      if (voiceEnabledRef.current) restartWakeRef.current?.();
    };
    rec.onerror = () => {
      setListeningForCommand(false);
      commandRecognitionRef.current = null;
      if (voiceEnabledRef.current) restartWakeRef.current?.();
    };
    try {
      rec.start();
    } catch {
      setListeningForCommand(false);
    }
  };

  // Background wake-word listener — restarts itself continuously while voice
  // mode is on, since browser SpeechRecognition sessions time out on their own.
  useEffect(() => {
    if (!voiceEnabled || !SpeechRecognitionApi) return undefined;

    let stopped = false;

    const startWakeListener = () => {
      if (stopped) return;
      const rec = new SpeechRecognitionApi();
      wakeRecognitionRef.current = rec;
      rec.lang = "en-US";
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0]?.transcript?.toLowerCase() || "";
          if (transcript.includes(WAKE_WORD)) {
            rec.stop();
            const after = transcript.split(WAKE_WORD)[1]?.trim();
            if (after) {
              setOpen(true);
              send(after, { fromVoice: true });
            } else {
              listenForCommand();
            }
            return;
          }
        }
      };
      rec.onend = () => {
        wakeRecognitionRef.current = null;
        // Auto-restart unless the toggle was turned off or we're mid-command.
        if (!stopped && voiceEnabledRef.current && !commandRecognitionRef.current) {
          setTimeout(startWakeListener, 300);
        }
      };
      rec.onerror = () => {
        // "no-speech"/"aborted" are routine — onend still fires and restarts.
      };
      try {
        rec.start();
      } catch {
        /* already running */
      }
    };

    restartWakeRef.current = startWakeListener;
    startWakeListener();

    return () => {
      stopped = true;
      restartWakeRef.current = null;
      wakeRecognitionRef.current?.stop();
      wakeRecognitionRef.current = null;
    };
  }, [voiceEnabled]);

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    // display:contents so this wrapper doesn't affect the header's flex
    // layout — it exists purely so the click-outside check can treat the
    // toggle button and the panel as one "inside" area (otherwise clicking
    // the toggle button to close would register as an outside click first,
    // closing it, then the button's own onClick would immediately reopen it).
    <div ref={containerRef} className="contents">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Ask about DevQuiz"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors text-base"
      >
        🤖
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 right-4 z-[100] w-[92vw] max-w-sm glass-card !bg-white dark:!bg-slate-900 p-0 flex flex-col shadow-2xl overflow-hidden"
            style={{ height: "min(70vh, 520px)" }}
          >
            <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">🤖 DevQuiz Assistant</p>
                <p className="text-[10px] text-slate-400">
                  {listeningForCommand ? "🎙️ Listening…" : "Only answers about this app — nothing else"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!!SpeechRecognitionApi && (
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled((v) => !v)}
                    title={voiceEnabled ? 'Voice wake word is on — say "Hey DevQuiz"' : "Enable voice wake word"}
                    className={`text-xs px-2 py-1 rounded-lg font-semibold transition-colors ${
                      voiceEnabled
                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-white/10 text-slate-400"
                    }`}
                  >
                    {voiceEnabled ? "🎙️ On" : "🎙️ Off"}
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none">
                  ✕
                </button>
              </div>
            </div>
            {voiceEnabled && (
              <p className="px-4 pt-2 text-[10px] text-slate-400 flex-shrink-0">
                Say <span className="font-semibold">"Hey DevQuiz"</span> followed by what you need — I'll open this panel and go there for you.
              </p>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.navigateTo && (
                      <button
                        type="button"
                        onClick={() => goTo(m.navigateTo)}
                        className="mt-2 text-xs px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-current font-semibold transition-colors"
                      >
                        Go there →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 text-sm text-slate-400">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-black/5 dark:border-white/10 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about a feature or page…"
                  disabled={sending}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={sending || !input.trim()}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
