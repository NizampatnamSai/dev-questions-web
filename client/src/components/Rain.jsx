import { useEffect, useRef } from "react";

export default function Rain({ heavy = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const drops = [];
    const count = heavy ? 80 : 50;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const left     = Math.random() * 110 - 5;
      const duration = 0.5 + Math.random() * 0.8;
      const delay    = Math.random() * -3;
      const height   = 12 + Math.random() * 20;
      const opacity  = 0.25 + Math.random() * 0.4;

      el.style.cssText = `
        position: fixed;
        top: -30px;
        left: ${left}vw;
        width: 1.5px;
        height: ${height}px;
        background: linear-gradient(to bottom, transparent, rgba(147,197,253,0.8));
        border-radius: 999px;
        pointer-events: none;
        z-index: 9998;
        opacity: ${opacity};
        animation: rainfall ${duration}s ${delay}s linear infinite;
      `;
      container.appendChild(el);
      drops.push(el);
    }
    return () => drops.forEach(d => d.remove());
  }, [heavy]);

  return <div ref={ref} aria-hidden="true" />;
}
