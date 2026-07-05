import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
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
