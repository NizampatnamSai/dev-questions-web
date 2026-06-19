import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Snowfall() {
  const { theme } = useTheme();

  useEffect(() => {
    // Create canvas imperatively so React StrictMode's double-invoke
    // doesn't try to transferControlToOffscreen() the same canvas twice.
    if (!HTMLCanvasElement.prototype.transferControlToOffscreen) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9999;";
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(
      new URL("./snowWorker.js", import.meta.url),
      { type: "module" }
    );
    const color = theme === "dark"
      ? "rgba(190,220,255,0.55)"
      : "rgba(80,110,160,0.5)";

    worker.postMessage(
      { type: "init", canvas: offscreen, width: canvas.width, height: canvas.height, color },
      [offscreen]
    );

    const onResize = () => {
      worker.postMessage({
        type:   "resize",
        width:  window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      worker.postMessage({ type: "stop" });
      worker.terminate();
      window.removeEventListener("resize", onResize);
      canvas.remove();
    };
  }, [theme]);

  return null;
}
