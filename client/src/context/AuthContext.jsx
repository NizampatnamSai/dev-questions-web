import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { requestAndRegisterToken, onForegroundMessage } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("devquiz_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    setUser(data.user);
    requestAndRegisterToken(api).catch(() => {});
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("devquiz_token", data.token);
    localStorage.setItem("devquiz_user", JSON.stringify(data.user));
    setUser(data.user);
    requestAndRegisterToken(api).catch(() => {});
    return data.user;
  };

  const logout = async () => {
    try {
      const { getToken, deleteToken } = await import("firebase/messaging");
      const token = await getToken(messaging).catch(() => null);
      if (token) await api.delete("/admin/fcm-token", { data: { token } }).catch(() => {});
      await deleteToken(messaging).catch(() => {});
    } catch {}
    localStorage.removeItem("devquiz_token");
    localStorage.removeItem("devquiz_user");
    setUser(null);
  };

  // Show foreground notifications as browser toasts
  useEffect(() => {
    if (!user) return;
    const unsub = onForegroundMessage(payload => {
      const { title, body } = payload.notification ?? {};
      if (title && "Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: "/vite.svg" });
      }
    });
    return () => unsub && unsub();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
