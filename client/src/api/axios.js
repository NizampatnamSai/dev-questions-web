import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devquiz_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userRaw = localStorage.getItem("devquiz_user");
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      config.headers["x-user-id"] = user.id;
    } catch {
      /* ignore */
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/registration-status");
    if (status === 401 && !isAuthCall) {
      localStorage.removeItem("devquiz_token");
      localStorage.removeItem("devquiz_user");
      window.location.href = "/login";
    }
    if (status === 403 && err.response?.data?.detail === "Account disabled") {
      localStorage.removeItem("devquiz_token");
      localStorage.removeItem("devquiz_user");
      window.location.href = "/login?disabled=1";
    }
    return Promise.reject(err);
  }
);

export default api;
