/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        html: "#fb923c",
        css: "#60a5fa",
        js: "#facc15",
        react: "#22d3ee",
        nextjs: "#f8fafc",
        rn: "#a78bfa",
        low: "#4ade80",
        medium: "#f59e0b",
        high: "#f87171",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
