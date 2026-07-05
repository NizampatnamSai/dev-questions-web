export default function FullWidthToggle({ fullWidth, onToggle }) {
  return (
    <button
      onClick={() => onToggle(!fullWidth)}
      title={fullWidth ? "Exit full width" : "Full width"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
    >
      {fullWidth ? (
        <>⤢ Exit Full Width</>
      ) : (
        <>⛶ Full Width</>
      )}
    </button>
  );
}
