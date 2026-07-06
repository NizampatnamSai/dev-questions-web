import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

// TEMP DEBUG — remove once the guest-mode mobile freeze is found. Reports any
// main-thread block over 50ms with its duration and (when available) which
// script/function attributed to it — catches the actual culprit regardless
// of which component it's in, instead of guessing which file to instrument.
if ("PerformanceObserver" in window) {
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn(
          `[LongTask DEBUG] ${Math.round(entry.duration)}ms block at ${Math.round(entry.startTime)}ms since navigation`,
          entry.attribution?.map((a) => ({ name: a.name, container: a.containerType, src: a.containerSrc })),
        );
      }
    }).observe({ type: "longtask", buffered: true });
  } catch (e) {
    console.warn("[LongTask DEBUG] not supported in this browser", e);
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
