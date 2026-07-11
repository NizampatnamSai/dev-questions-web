import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Stamped once per build (not per request) — every deploy gets a unique,
// naturally-ordered version string so the backend can tell which users are
// still running an older bundle after admin flips Force Update on.
const BUILD_VERSION = new Date().toISOString();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(BUILD_VERSION),
  },
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Trailing slash matters: Vite's string proxy keys match by plain prefix,
      // so a bare "/api" would ALSO catch page routes like /api-tester and
      // /api-docs (they literally start with the substring "/api") and proxy
      // them to the backend — which has no such route, hence a hard refresh
      // on those pages returned the backend's own {"detail":"Not Found"}
      // instead of Vite serving the SPA's index.html.
      "/api/": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
