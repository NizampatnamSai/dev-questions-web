import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// Module-level singleton: the socket/REST connection is opened ONCE for the
// whole app no matter how many components call this hook (BottomNav,
// NotificationBell, Notifications page can all be mounted at the same time).
// Components only ever subscribe to the shared count via `listeners`.
let globalCount = 0;
const listeners = new Set();
let connectedUserId = null;
let ws = null;
let intentionalClose = false;
let lastFetchAt = 0;
const MIN_FETCH_INTERVAL_MS = 20_000; // the websocket handles real-time updates —
// this REST fetch is just a fallback, so it never needs to run more than this often.

function setGlobalCount(n) {
  globalCount = n;
  listeners.forEach((fn) => fn(n));
}

function fetchCount({ throttle = false } = {}) {
  if (throttle && Date.now() - lastFetchAt < MIN_FETCH_INTERVAL_MS) return Promise.resolve();
  lastFetchAt = Date.now();
  return api
    .get("/admin/notifications/my/unread-count")
    .then(({ data }) => setGlobalCount(data.count || 0))
    .catch(() => {});
}

function connectFor(userId) {
  if (connectedUserId === userId) return; // already connected for this user
  teardown();
  connectedUserId = userId;
  intentionalClose = false;

  fetchCount();

  const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
  const wsBase = apiUrl.startsWith("http")
    ? apiUrl.replace(/^http/, "ws").replace(/\/api$/, "")
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;
  // Identity is derived from this token server-side — a raw user_id query
  // param would let anyone read another user's unread notification count.
  const token = encodeURIComponent(localStorage.getItem("devquiz_token") || "");
  const wsUrl = `${wsBase}/api/admin/notifications/ws?token=${token}`;

  let retryDelay = 3000;
  const connect = () => {
    if (intentionalClose) return;
    const socket = new WebSocket(wsUrl);
    ws = socket;

    socket.onopen = () => { retryDelay = 3000; }; // reset backoff once a connection actually succeeds

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "unread_count") setGlobalCount(msg.count);
        else if (msg.type === "new_notification") setGlobalCount(globalCount + 1);
      } catch {}
    };

    socket.onerror = () => {};
    socket.onclose = () => {
      if (!intentionalClose && connectedUserId === userId) {
        setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30_000); // back off up to 30s so a down backend can't be hammered
      }
    };
  };
  connect();

  window.addEventListener("focus", onFocus);
}

function onFocus() {
  fetchCount({ throttle: true });
}

function teardown() {
  intentionalClose = true;
  connectedUserId = null;
  window.removeEventListener("focus", onFocus);
  if (ws) {
    ws.onclose = null;
    ws.close();
    ws = null;
  }
}

export function useNotificationCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(globalCount);

  useEffect(() => {
    listeners.add(setCount);
    return () => listeners.delete(setCount);
  }, []);

  useEffect(() => {
    if (!user || user.isGuest) {
      if (connectedUserId) teardown();
      return;
    }
    connectFor(user.id);
    // Deliberately no cleanup here — the connection is app-wide and should
    // outlive any single component; it's replaced (not torn down) when the
    // user changes, and torn down above when they log out.
  }, [user?.id, user?.isGuest]);

  const updateCount = (n) => setGlobalCount(n);
  return { count, updateCount };
}
