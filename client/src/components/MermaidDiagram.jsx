import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "../context/ThemeContext";

let counter = 0;

export default function MermaidDiagram({ code }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    mermaid.initialize({ startOnLoad: false, theme: theme === "dark" ? "dark" : "default", securityLevel: "strict" });
    const id = `mermaid-diagram-${counter++}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Couldn't render this diagram");
      });
    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  if (error) {
    return (
      <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl p-3">
        ⚠️ {error}
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-diagram overflow-x-auto [&_svg]:mx-auto" />;
}
