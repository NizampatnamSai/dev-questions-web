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
    if (err.response?.status === 401) {
      localStorage.removeItem("devquiz_token");
      localStorage.removeItem("devquiz_user");
    }
    return Promise.reject(err);
  }
);

export default api;
