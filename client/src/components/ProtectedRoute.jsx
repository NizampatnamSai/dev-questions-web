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

  if (user.isGuest && path && !GUEST_ALLOWED.some((p) => path.startsWith(p))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
