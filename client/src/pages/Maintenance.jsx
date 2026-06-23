import { useEffect, useState } from "react";

export default function Maintenance({ message }) {
  const [eta, setEta] = useState(null);

  useEffect(() => {
    // Calculate approximate ETA based on time of day
    const now = new Date();
    const nextHour = new Date(now.getHours() + 1, 0, 0);
    const diffMs = nextHour - now;
    const minutes = Math.ceil(diffMs / 60000);
    setEta(minutes > 60 ? "a few hours" : `${minutes} minutes`);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col items-center justify-center z-[9999] text-center px-6">
      {/* Reduced animation: only one pulse instead of multiple */}
      <div className="text-7xl mb-6 opacity-80">🔧</div>

      <h1 className="text-3xl font-bold text-white mb-3">Under Maintenance</h1>

      <p className="text-slate-300 text-base max-w-sm leading-relaxed mb-6">
        {message || "We're currently performing maintenance. We'll be back shortly!"}
      </p>

      {/* ETA display */}
      {eta && (
        <p className="text-sm text-slate-400 mb-8">
          Estimated time: <span className="text-amber-400 font-semibold">{eta}</span>
        </p>
      )}

      {/* Minimal status indicator (no pulse) */}
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span>We'll notify you when back online</span>
      </div>

      {/* Performance optimization: disable weather effects in maintenance mode */}
      <style>{`
        html.weather-snowy, html.weather-rainy, html.weather-stormy {
          display: none;  /* Disable weather effects to save performance */
        }
      `}</style>
    </div>
  );
}
