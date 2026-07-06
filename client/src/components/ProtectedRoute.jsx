import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Routes that guests ARE allowed to access — the single source of truth.
// Sidebar.jsx imports this same array so the nav links guests SEE always
// match the routes they're actually ALLOWED to reach (previously these were
// two separately-maintained lists that drifted apart).
export const GUEST_ALLOWED = [
  "/dashboard",
  "/community",
  "/js-compiler",
  "/json-parser",
  "/regex-tester",
  "/cron-builder",
  "/jwt-decoder",
  "/study",
  "/api-tester",
  "/background-remover",
  "/devtools", // covers the Mock API Generator tab (?tool=mock-api) — public, no AI cost
  "/meetings", // the invite-list view needs login, but the join-by-code box is intentionally open to guests
];

// Exact match on the prefix, or the prefix followed by "/" or "?" — a plain
// `path.startsWith(p)` would let "/study" in the list above also match
// "/study-advanced" (wrong page, no guest support) since it's a literal
// string-prefix match with no path-segment boundary. This bit us for real:
// guests could see + open "AI Study Lab" only to have its API calls bounce
// them to /login once the page tried to fetch data as a real user.
export function isGuestAllowedPath(path) {
  return GUEST_ALLOWED.some(
    (p) => path === p || path.startsWith(p + "/") || path.startsWith(p + "?"),
  );
}

export default function ProtectedRoute({ children, path }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isGuest && path && !isGuestAllowedPath(path)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
