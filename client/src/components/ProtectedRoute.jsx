import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Routes that guests ARE allowed to access
const GUEST_ALLOWED = [
  "/dashboard",
  "/community",
  "/js-compiler",
  "/json-parser",
  "/study",
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
