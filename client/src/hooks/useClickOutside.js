import { useEffect, useRef } from "react";

// Closes a panel/modal on any click outside `ref`'s element — a document-level
// mousedown listener works regardless of z-index/stacking-context quirks that
// can make a full-screen backdrop's own onClick unreliable (e.g. a sticky
// sidebar or another fixed element sitting in a different stacking context).
export function useClickOutside(ref, onOutsideClick, active = true) {
  const callbackRef = useRef(onOutsideClick);
  callbackRef.current = onOutsideClick;

  useEffect(() => {
    if (!active) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callbackRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [active, ref]);
}
