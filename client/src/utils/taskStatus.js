// Jira-style workflow — keys must match server TASK_STATUSES (routers/tasks.py).
export const TASK_STATUSES = [
  {
    key: "todo",
    label: "To Do",
    icon: "📋",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    column: "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  {
    key: "started",
    label: "Started",
    icon: "🚀",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    column: "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40",
    dot: "bg-blue-500",
  },
  {
    key: "testing",
    label: "Testing",
    icon: "🧪",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    column: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40",
    dot: "bg-amber-500",
  },
  {
    key: "completed",
    label: "Completed",
    icon: "✅",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    column: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40",
    dot: "bg-emerald-500",
  },
];

export function statusMeta(key) {
  return TASK_STATUSES.find((s) => s.key === key) || TASK_STATUSES[0];
}
