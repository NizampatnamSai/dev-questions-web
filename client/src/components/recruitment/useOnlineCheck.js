import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api/axios";

// Drives the server-side online check (POST /govt-exams/refresh), polls its
// progress, and calls `onFinished` so the page reloads the merged data.
//
// phase: idle | starting | running | done | cooldown | failed | unauthenticated
const POLL_MS = 2500;

export function useOnlineCheck(onFinished) {
  const [phase, setPhase] = useState("idle");
  const [run, setRun] = useState(null);
  const [info, setInfo] = useState({}); // { nextAllowedAt, canForce, message }
  const timer = useRef(null);
  const alive = useRef(true);
  const finishedRef = useRef(onFinished);
  finishedRef.current = onFinished;

  const stopPolling = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const poll = useCallback(async () => {
    try {
      const { data } = await api.get("/govt-exams/refresh/status");
      if (!alive.current) return;
      setRun(data.run);
      if (data.running || data.run?.state === "running") {
        setPhase("running");
        timer.current = setTimeout(poll, POLL_MS);
      } else {
        setPhase(data.run?.state === "failed" ? "failed" : "done");
        finishedRef.current?.();
      }
    } catch {
      if (!alive.current) return;
      // Transient network error — keep trying while the check runs server-side.
      timer.current = setTimeout(poll, POLL_MS * 2);
    }
  }, []);

  const start = useCallback(async (force = false) => {
    stopPolling();
    setPhase("starting");
    setInfo({});
    try {
      const { data } = await api.post("/govt-exams/refresh", { force });
      setRun(data.run);
      if (data.started || data.reason === "running") {
        setPhase("running");
        timer.current = setTimeout(poll, POLL_MS);
      } else if (data.reason === "cooldown") {
        setPhase("cooldown");
        setInfo({ nextAllowedAt: data.nextAllowedAt, canForce: data.canForce });
        finishedRef.current?.(); // still pull the latest stored data
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setPhase("unauthenticated");
      } else {
        setPhase("failed");
        setInfo({ message: err?.response?.data?.detail || "Couldn't start the online check." });
      }
      finishedRef.current?.();
    }
  }, [poll]);

  // Resume progress if a check is already running (e.g. started in another tab).
  useEffect(() => {
    alive.current = true;
    api.get("/govt-exams/refresh/status")
      .then(({ data }) => {
        if (!alive.current) return;
        if (data.running) {
          setRun(data.run);
          setPhase("running");
          timer.current = setTimeout(poll, POLL_MS);
        }
      })
      .catch(() => { /* not signed in or offline — nothing to resume */ });
    return () => {
      alive.current = false;
      stopPolling();
    };
  }, [poll]);

  return { phase, run, info, start, dismiss: () => setPhase("idle") };
}
