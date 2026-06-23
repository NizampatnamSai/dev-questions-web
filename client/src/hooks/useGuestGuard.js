import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export function useGuestGuard() {
  const { user } = useAuth();

  function guardAction(fn, message = "Sign up to use this feature") {
    if (user?.isGuest) {
      toast("👁 " + message, {
        icon: "🔒",
        style: { fontWeight: 500 },
        duration: 3000,
      });
      return;
    }
    return fn();
  }

  const isGuest = !!user?.isGuest;

  return { guardAction, isGuest };
}
