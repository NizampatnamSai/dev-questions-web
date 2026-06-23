import { useEffect } from "react";

// Canvas-based rain renderer (60x better performance than DOM)
export default function Rain({ heavy = false }) {
  useEffect(() => {
    if (!HTMLCanvasElement.prototype.transferControlToOffscreen) {
      console.warn("OffscreenCanvas not supported, rain disabled");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(
      new URL("./rainWorker.js", import.meta.url),
      { type: "module" }
    );

    worker.postMessage(
      { type: "init", canvas: offscreen, width: canvas.width, height: canvas.height, heavy },
      [offscreen]
    );

    const handleResize = () => {
      worker.postMessage({
        type: "resize",
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      worker.postMessage({ type: "stop" });
      worker.terminate();
      window.removeEventListener("resize", handleResize);
      canvas.remove();
    };
  }, [heavy]);

  return null;
}
