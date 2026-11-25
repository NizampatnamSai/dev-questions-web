import { useCallback, useEffect, useState } from "react";

// A set of bookmarked ids persisted in localStorage under `storageKey`.
// Every hook instance using the same key stays in sync — within the tab via a
// custom event, across tabs via the native `storage` event — so bookmarking a
// value in one panel shows up immediately in another.
const EVENT = "devquiz:bookmarks";

function read(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

export function useBookmarks(storageKey) {
  const [ids, setIds] = useState(() => read(storageKey));

  useEffect(() => {
    const sync = (e) => {
      if (e.type === "storage" ? e.key === storageKey : e.detail === storageKey) setIds(read(storageKey));
    };
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT, sync);
    };
  }, [storageKey]);

  const toggle = useCallback(
    (id) => {
      const next = read(storageKey);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        /* storage full or disabled — keep it in memory only */
      }
      setIds(new Set(next));
      window.dispatchEvent(new CustomEvent(EVENT, { detail: storageKey }));
    },
    [storageKey]
  );

  return { ids, has: (id) => ids.has(id), toggle, count: ids.size };
}
