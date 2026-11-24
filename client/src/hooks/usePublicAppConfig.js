import { useSyncExternalStore } from "react";

// Shared copy of GET /admin/app-config/public. App.jsx already fetches it on
// every navigation and on a 30s poll — it pushes the result in here so
// Sidebar, GlobalSearch and page gates can read the same flags without each
// running their own fetch/poll. null until the first response arrives.
let current = null;
const listeners = new Set();

export function setPublicAppConfig(config) {
  current = config;
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export default function usePublicAppConfig() {
  return useSyncExternalStore(subscribe, () => current);
}
