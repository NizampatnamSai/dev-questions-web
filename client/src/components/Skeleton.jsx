// Reusable skeleton building blocks

export function SkeletonLine({ w = "full", h = "3" }) {
  return <div className={`h-${h} w-${w} bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse`} />;
}

export function SkeletonBox({ h = "10", rounded = "xl" }) {
  return <div className={`h-${h} w-full bg-slate-200 dark:bg-slate-700 rounded-${rounded} animate-pulse`} />;
}

export function SkeletonAvatar({ size = "10" }) {
  return <div className={`w-${size} h-${size} rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse flex-shrink-0`} />;
}

// Generic question card skeleton — matches QuestionCard layout
export function SkeletonQuestionCard() {
  return (
    <div className="glass-card p-5 space-y-3 animate-pulse">
      <div className="flex gap-2">
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      </div>
      <div className="flex gap-3 pt-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-14" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-14" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-14" />
      </div>
    </div>
  );
}

// Leaderboard row skeleton
export function SkeletonLeaderRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-48" />
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-10" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-10" />
    </div>
  );
}

// Admin user row skeleton
export function SkeletonUserRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-1">
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-2.5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
      <td className="px-4 py-3"><div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
      <td className="px-4 py-3"><div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" /></td>
      <td className="px-4 py-3"><div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
    </tr>
  );
}
