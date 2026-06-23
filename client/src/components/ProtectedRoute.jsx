import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages guests cannot access at all
const GUEST_BLOCKED = ["/generate", "/my-questions", "/bookmarks", "/progress", "/admin", "/mock-interview", "/flashcards", "/quiz", "/leaderboard"];

export default function ProtectedRoute({ children, path }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.isGuest && path && GUEST_BLOCKED.some(p => path.startsWith(p))) {
    return <Navigate to="/community" replace />;
  }

  return children;
}
