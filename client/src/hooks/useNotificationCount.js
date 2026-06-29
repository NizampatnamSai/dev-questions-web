import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

let globalCount = 0;
const listeners = new Set();

function setGlobalCount(n) {
  globalCount = n;
  listeners.forEach((fn) => fn(n));
}

export function useNotificationCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(globalCount);
  const wsRef = useRef(null);

  useEffect(() => {
    listeners.add(setCount);
    return () => listeners.delete(setCount);
  }, []);

  useEffect(() => {
    if (!user || user.isGuest) return;

    // Initial fetch
    api
      .get("/admin/notifications/my/unread-count")
      .then(({ data }) => setGlobalCount(data.count || 0))
      .catch(() => {});

    // WebSocket for real-time updates
    const apiUrl = import.meta.env.VITE_API_URL ?? "/api";
    const wsBase = apiUrl.startsWith("http")
      ? apiUrl.replace(/^http/, "ws").replace(/\/api$/, "")
      : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;
    const wsUrl = `${wsBase}/api/admin/notifications/ws?user_id=${user.id}`;

    let intentionalClose = false;
    const connect = () => {
      if (intentionalClose) return;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "unread_count") setGlobalCount(msg.count);
          else if (msg.type === "new_notification")
            setGlobalCount((c) => c + 1);
        } catch {}
      };

      ws.onerror = () => {}; // suppress console errors
      ws.onclose = () => {
        if (!intentionalClose) setTimeout(connect, 5000);
      };
    };

    connect();

    // Refetch on window focus as fallback
    const onFocus = () =>
      api
        .get("/admin/notifications/my/unread-count")
        .then(({ data }) => setGlobalCount(data.count || 0))
        .catch(() => {});
    window.addEventListener("focus", onFocus);

    return () => {
      intentionalClose = true;
      window.removeEventListener("focus", onFocus);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [user?.id]);

  const updateCount = (count) => setGlobalCount(count);
  return { count, updateCount };
}
