import { useEffect, useRef } from "react";

// Closes a panel/modal on any click outside `refs`'s element(s) — a document-level
// mousedown listener works regardless of z-index/stacking-context quirks that
// can make a full-screen backdrop's own onClick unreliable (e.g. a sticky
// sidebar or another fixed element sitting in a different stacking context).
// `refs` can be a single ref or an array of refs — pass an array when the
// trigger and its panel are portaled separately (e.g. the panel renders into
// document.body to escape an ancestor's stacking context) and so no longer
// share a single containing DOM node.
export function useClickOutside(refs, onOutsideClick, active = true) {
  const callbackRef = useRef(onOutsideClick);
  callbackRef.current = onOutsideClick;

  useEffect(() => {
    if (!active) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const handler = (e) => {
      const inside = list.some((r) => r.current && r.current.contains(e.target));
      if (!inside) callbackRef.current();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [active]);
}
