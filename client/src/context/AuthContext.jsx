import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { messaging, requestAndRegisterToken, onForegroundMessage } from "../firebase";

const AuthContext = createContext(null);

export const GUEST_USER = { id: "guest", name: "Guest", role: "guest", isGuest: true };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (localStorage.getItem("devquiz_guest") === "1") return GUEST_USER;
    const raw = localStorage.getItem("devquiz_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [profile, setProfile] = useState(null); // avatar_url, bio, etc.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("devquiz_guest") === "1") {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("devquiz_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("devquiz_user", JSON.stringify(data.user));
        if (Notification.permission === "granted") {
          requestAndRegisterToken(api).catch(() => {});
        }
        api.get("/profile/my/profile").then(r => setProfile(r.data)).catch(() => {});
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("devquiz_token");
        localStorage.removeItem("devquiz_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("devquiz_token", data.token);
    localStorage.setItem("devquiz_user", JSON.stringify(data.user));
    localStorage.removeItem("devquiz_guest");
    setUser(data.user);
    requestAndRegisterToken(api).catch(() => {});
    api.get("/profile/my/profile").then(r => setProfile(r.data)).catch(() => {});
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  };

  const enterGuest = () => {
    localStorage.setItem("devquiz_guest", "1");
    setUser(GUEST_USER);
  };

  const logout = () => {
    setProfile(null);
    if (user?.isGuest) {
      localStorage.removeItem("devquiz_guest");
      setUser(null);
      return;
    }
    // Clear session immediately — don't wait for FCM cleanup
    localStorage.removeItem("devquiz_token");
    localStorage.removeItem("devquiz_user");
    setUser(null);
    // Fire-and-forget FCM token cleanup in background
    Promise.resolve().then(async () => {
      try {
        const { getToken, deleteToken } = await import("firebase/messaging");
        const fcmToken = await Promise.race([
          getToken(messaging).catch(() => null),
          new Promise(r => setTimeout(() => r(null), 3000)),
        ]);
        if (fcmToken) {
          api.delete("/admin/fcm-token", { data: { token: fcmToken } }).catch(() => {});
          deleteToken(messaging).catch(() => {});
        }
      } catch {}
    });
  };

  useEffect(() => {
    if (!user || user.isGuest) return;

    // Listen for service-worker PLAY_NOTIFICATION_SOUND messages (background notifications)
    const swMsgHandler = (event) => {
      if (event.data?.type === "PLAY_NOTIFICATION_SOUND") {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.7;
        audio.play().catch(() => {});
      }
    };
    navigator.serviceWorker?.addEventListener("message", swMsgHandler);

    const unsub = onForegroundMessage(payload => {
      const { title, body } = payload.notification ?? {};
      const path = payload.data?.path;
      if (!title) return;

      // Play notification sound (foreground)
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch {}

      // Show a real native browser notification even when app is open
      if ("Notification" in window && Notification.permission === "granted") {
        const n = new Notification(title, {
          body: body || "",
          icon: "/logo192.png",
          badge: "/logo192.png",
          tag: path || "devquiz",
        });
        if (path) n.onclick = () => { window.focus(); window.location.href = path; };
      }

      // Also show in-app toast as fallback
      toast(
        (t) => (
          <div
            className="cursor-pointer"
            onClick={() => {
              toast.dismiss(t.id);
              if (path) window.location.href = path;
            }}
          >
            <p className="font-semibold text-sm">{title}</p>
            {body && <p className="text-xs text-slate-500 mt-0.5">{body}</p>}
            {path && <p className="text-xs text-indigo-500 mt-1">Tap to open →</p>}
          </div>
        ),
        { duration: 6000, icon: "🔔" }
      );
    });
    return () => {
      unsub && unsub();
      navigator.serviceWorker?.removeEventListener("message", swMsgHandler);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, enterGuest, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
