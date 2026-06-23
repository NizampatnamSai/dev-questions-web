export default function Maintenance({ message }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] text-center px-6">
      <div className="text-7xl mb-6 animate-pulse">🔧</div>
      <h1 className="text-3xl font-bold text-white mb-3">Under Maintenance</h1>
      <p className="text-slate-400 text-base max-w-sm leading-relaxed mb-8">
        {message || "We're currently performing maintenance. We'll be back shortly!"}
      </p>
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        We'll notify you once we're back
      </div>
    </div>
  );
}
