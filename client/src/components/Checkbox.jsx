// Custom-styled checkbox (Material/Google look: rounded square, filled +
// checkmark when checked) replacing the native input[type=checkbox], which
// renders as a tiny inconsistent box across browsers and can't pick up the
// app's own accent color reliably everywhere.

// Just the visual box + hidden native input, no wrapping <label> — for
// composing into an existing custom <label> that has its own extra content
// (e.g. a name + right-aligned email), where nesting a full <Checkbox>'s own
// <label> inside it would be invalid HTML.
export function CheckboxBox({ checked, onChange, className = "", disabled = false }) {
  return (
    <span className={`relative inline-flex flex-shrink-0 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-colors ${
          checked
            ? "bg-indigo-600 border-indigo-600"
            : "bg-transparent border-slate-400 dark:border-slate-500 peer-hover:border-indigo-400"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </span>
  );
}

export default function Checkbox({ checked, onChange, label, className = "", disabled = false }) {
  return (
    <label className={`inline-flex items-center gap-2.5 select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      <CheckboxBox checked={checked} onChange={onChange} disabled={disabled} />
      {label && <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>}
    </label>
  );
}
