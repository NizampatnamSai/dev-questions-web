import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("devquiz_theme") || "dark");
  const [snow, setSnow] = useState(() => localStorage.getItem("devquiz_snow") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("devquiz_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("devquiz_snow", String(snow));
  }, [snow]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleSnow  = () => setSnow((s) => !s);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, snow, toggleSnow }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
