import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { CheckboxBox } from "../components/Checkbox";

function statusBadge(m) {
  if (m.status === "ended") return { text: "Ended", cls: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400" };
  if (m.status === "live") return { text: "🔴 Live", cls: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300" };
  return { text: `Scheduled — ${new Date(m.scheduledAt).toLocaleString()}`, cls: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300" };
}

function ScheduleModal({ users, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [invited, setInvited] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleInvite = (uid) =>
    setInvited((prev) => (prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]));

  const submit = async () => {
    if (!title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const { data } = await api.post("/meetings", {
        title: title.trim(),
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        invitedUserIds: invited,
      });
      toast.success(scheduledAt ? "Meeting scheduled" : "Meeting started");
      onCreated(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create meeting");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-6 max-w-md w-full space-y-4 max-h-[85vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">📹 New Meeting</h2>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly sync"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
            Schedule for later (optional — leave blank to start now)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
            Invite ({invited.length} selected)
          </label>
          <div className="max-h-40 overflow-y-auto space-y-1 border border-slate-200 dark:border-white/10 rounded-xl p-2">
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
                <CheckboxBox checked={invited.includes(u.id)} onChange={() => toggleInvite(u.id)} />
                <span className="text-slate-700 dark:text-slate-200">{u.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{u.email}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={saving} className="flex-1 btn-primary py-2.5 disabled:opacity-50">
            {saving ? "Creating…" : scheduledAt ? "Schedule" : "Start Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function JitsiRoom({ meeting, displayName, isAdmin, onLeave, onEndMeeting }) {
  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const src = `https://meet.jit.si/${meeting.roomName}#userInfo.displayName="${encodeURIComponent(displayName)}"&config.prejoinPageEnabled=true`;

  return (
    <div
      className={
        minimized
          ? "fixed bottom-4 right-4 z-[200] w-80 h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black flex flex-col"
          : "fixed inset-0 bg-black z-[200] flex flex-col"
      }
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-white flex-shrink-0">
        <span className="text-sm font-semibold truncate">📹 {meeting.title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMinimized((v) => !v)}
            title={minimized ? "Expand" : "Minimize — keep the call running while you use the rest of the site"}
            className="text-sm w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {minimized ? "⤢" : "—"}
          </button>
          {isAdmin && (
            <button
              onClick={onEndMeeting}
              title="End the meeting for everyone"
              className="text-sm px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors whitespace-nowrap"
            >
              End Meeting
            </button>
          )}
          <button onClick={onLeave} className="text-sm px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors whitespace-nowrap">
            Leave
          </button>
        </div>
      </div>
      <div className="relative flex-1">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black text-white text-center px-4">
            <span className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            {!minimized && (
              <>
                <p className="text-sm text-slate-300">Connecting to the meeting…</p>
                <p className="text-xs text-slate-500">First time joining? Your browser may ask for camera/mic permission.</p>
              </>
            )}
          </div>
        )}
        <iframe
          src={src}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-0"
          title="DevQuiz Meeting"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

export default function Meetings() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";
  const isGuest = !user || user.isGuest;
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(!isGuest);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joiningByCode, setJoiningByCode] = useState(false);

  const load = (silent = false) => {
    api.get("/meetings")
      .then(({ data }) => setMeetings(data))
      .catch(() => { if (!silent) toast.error("Failed to load meetings"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isGuest) return; // guests have no invite list to fetch — code entry is their only path in
    load();
    if (isAdmin) {
      api.get("/admin/users").then(({ data }) => setUsers(data.filter((u) => u.id !== user?.id))).catch(() => {});
    }
    // Meetings don't have their own push channel yet — a short poll while this
    // page is open is enough to pick up new invites/status changes without
    // needing a manual refresh, and is simpler/safer than extending the
    // notification websocket's protocol just for this one page.
    const interval = setInterval(() => load(true), 15_000);
    return () => clearInterval(interval);
  }, []);

  const joinByCode = async () => {
    const code = joinCodeInput.trim();
    if (!code) return;
    setJoiningByCode(true);
    try {
      const { data } = await api.get(`/meetings/join/${encodeURIComponent(code)}`);
      setActiveMeeting(data);
      setJoinCodeInput("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired code");
    } finally {
      setJoiningByCode(false);
    }
  };

  const endMeeting = async (id) => {
    try {
      await api.patch(`/meetings/${id}/end`);
      setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status: "ended" } : m)));
      toast.success("Meeting ended");
    } catch {
      toast.error("Failed to end meeting");
    }
  };

  const deleteMeeting = async (id) => {
    try {
      await api.delete(`/meetings/${id}`);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      toast.success("Meeting deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const join = (m) => setActiveMeeting(m);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📹 Meetings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? "Free video calls (powered by Jitsi Meet's public server — no paid plan needed). Only admins can start or schedule a meeting and choose who's invited."
              : isGuest
                ? "Have a meeting code from the admin? Enter it below to join."
                : "You'll see meetings the admin has invited you to."}
          </p>
          {isAdmin && (
            <p className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mt-2">
              ⚠️ Jitsi's free public server requires whoever joins <strong>first</strong> to sign in once
              (Google or GitHub) to become the meeting's moderator and start it — this is Jitsi's own
              anti-spam requirement, not something we control. Once you've started it that way, everyone
              else you invite can join with no login at all.
            </p>
          )}
        </div>
        {isAdmin && (
          <button onClick={() => setShowSchedule(true)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap">
            + New Meeting
          </button>
        )}
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">🔑 Join with a code:</p>
        <input
          value={joinCodeInput}
          onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && joinByCode()}
          placeholder="e.g. AB12CD"
          maxLength={6}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-sm font-mono tracking-widest uppercase outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={joinByCode}
          disabled={!joinCodeInput.trim() || joiningByCode}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
        >
          {joiningByCode ? "Joining…" : "Join"}
        </button>
      </div>

      {!isGuest && (loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="glass-card h-20 animate-pulse" />)}</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-2">📹</p>
          <p>{isAdmin ? "No meetings yet — click \"+ New Meeting\" to start one." : "No meetings you've been invited to yet."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => {
            const badge = statusBadge(m);
            return (
              <div key={m.id} className="glass-card p-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{m.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">By {m.createdByName} · {m.invitedUserIds.length} invited</p>
                  <span className={`inline-block mt-1.5 text-[10px] px-2 py-1 rounded-full font-semibold ${badge.cls}`}>{badge.text}</span>
                  {isAdmin && m.joinCode && m.status !== "ended" && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(m.joinCode); toast.success("Code copied"); }}
                      title="Copy join code — anyone with this code can join, invited or not"
                      className="ml-2 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 font-mono tracking-widest transition-colors"
                    >
                      🔑 {m.joinCode} 📋
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {m.status !== "ended" && (
                    <button onClick={() => join(m)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors">
                      Join
                    </button>
                  )}
                  {isAdmin && m.status !== "ended" && (
                    <button onClick={() => endMeeting(m.id)} className="text-xs px-3 py-1.5 rounded-lg border border-amber-300/50 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                      End
                    </button>
                  )}
                  {isAdmin && (
                    <button onClick={() => deleteMeeting(m.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-300/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      🗑
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <AnimatePresence>
        {showSchedule && (
          <ScheduleModal
            users={users}
            onClose={() => setShowSchedule(false)}
            onCreated={(m) => {
              setMeetings((prev) => [m, ...prev]);
              // Only auto-join immediate meetings — one scheduled for later
              // shouldn't drop the admin straight into a call.
              if (!m.scheduledAt) setActiveMeeting(m);
            }}
          />
        )}
      </AnimatePresence>

      {activeMeeting && (
        <JitsiRoom
          meeting={activeMeeting}
          displayName={user?.name || "Guest"}
          isAdmin={isAdmin}
          onLeave={() => setActiveMeeting(null)}
          onEndMeeting={async () => {
            await endMeeting(activeMeeting.id);
            setActiveMeeting(null);
          }}
        />
      )}
    </motion.div>
  );
}
