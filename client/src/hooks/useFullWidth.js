import { useState, useEffect } from "react";

const STORAGE_KEY = "devquiz_full_width";

// Global "theater mode" preference, like YouTube's full-width toggle —
// persisted across sessions so it doesn't reset on every visit.
export default function useFullWidth() {
  const [fullWidth, setFullWidth] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, fullWidth ? "1" : "0");
    } catch {}
  }, [fullWidth]);

  return [fullWidth, setFullWidth];
}
