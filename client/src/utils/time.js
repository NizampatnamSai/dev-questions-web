export function parseUTC(iso) {
  if (!iso) return new Date(NaN);
  return new Date(iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z");
}

export function fmtDateTime(iso) {
  const d = parseUTC(iso);
  if (isNaN(d)) return "—";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const timeStr = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
  if (dDay.getTime() === today.getTime())     return `Today • ${timeStr}`;
  if (dDay.getTime() === yesterday.getTime()) return `Yesterday • ${timeStr}`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ` • ${timeStr}`;
}

export function fmtDate(iso) {
  const d = parseUTC(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtTime(iso) {
  const d = parseUTC(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(iso) {
  const diff = (Date.now() - parseUTC(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
