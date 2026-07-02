import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const HISTORY_KEY = "devquiz_api_tester_history";
const BODY_TYPES = [
  { key: "raw", label: "Raw (JSON/Text)" },
  { key: "form-data", label: "Form Data" },
  { key: "x-www-form-urlencoded", label: "x-www-form-urlencoded" },
];

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 15)));
  } catch {}
}

function statusColor(status) {
  if (status >= 200 && status < 300) return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
  if (status >= 300 && status < 400) return "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
  if (status >= 400) return "text-red-500 bg-red-50 dark:bg-red-500/10";
  return "text-slate-500 bg-slate-50 dark:bg-slate-500/10";
}

function KeyValueEditor({ rows, onChange, keyPlaceholder = "key", valuePlaceholder = "value" }) {
  const update = (i, field, value) => onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  const add = () => onChange([...rows, { key: "", value: "" }]);
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-1.5">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={r.key}
            onChange={(e) => update(i, "key", e.target.value)}
            placeholder={keyPlaceholder}
            spellCheck={false}
            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={r.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder={valuePlaceholder}
            spellCheck={false}
            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={() => remove(i)} className="px-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs">
            ✕
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20">
        + Add row
      </button>
    </div>
  );
}

export default function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.github.com/users/octocat");
  const [panel, setPanel] = useState("headers"); // headers | body | auth
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [bodyType, setBodyType] = useState("raw");
  const [body, setBody] = useState("");
  const [formFields, setFormFields] = useState([{ key: "", value: "" }]);
  const [authType, setAuthType] = useState("none"); // none | bearer
  const [authToken, setAuthToken] = useState("");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [respTab, setRespTab] = useState("body"); // body | headers
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const send = async () => {
    if (!url.trim()) {
      toast.error("Enter a URL");
      return;
    }
    setSending(true);
    setError("");
    setResponse(null);
    try {
      const headerObj = {};
      headers.forEach((h) => {
        if (h.key.trim()) headerObj[h.key.trim()] = h.value;
      });
      if (authType === "bearer" && authToken.trim()) {
        headerObj["Authorization"] = `Bearer ${authToken.trim()}`;
      }
      const noBody = ["GET", "HEAD"].includes(method);
      const { data } = await api.post("/dev-tools/http-request", {
        method,
        url: url.trim(),
        headers: headerObj,
        bodyType: noBody ? "none" : bodyType,
        body: !noBody && bodyType === "raw" ? body : "",
        formFields: !noBody && bodyType !== "raw" ? formFields.filter((f) => f.key.trim()) : [],
      });
      setResponse(data);
      const entry = { method, url: url.trim(), ts: Date.now() };
      const next = [entry, ...history.filter((h) => !(h.method === method && h.url === entry.url))];
      setHistory(next);
      saveHistory(next);
    } catch (err) {
      setError(err.response?.data?.detail || "Request failed");
    } finally {
      setSending(false);
    }
  };

  const resetAll = () => {
    setMethod("GET");
    setUrl("");
    setPanel("headers");
    setHeaders([{ key: "", value: "" }]);
    setBodyType("raw");
    setBody("");
    setFormFields([{ key: "", value: "" }]);
    setAuthType("none");
    setAuthToken("");
    setResponse(null);
    setError("");
    toast.success("Cleared");
  };

  const loadFromHistory = (h) => {
    setMethod(h.method);
    setUrl(h.url);
  };

  const formatBody = () => {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      toast.error("Not valid JSON");
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  let prettyBody = response?.body || "";
  if (response?.body) {
    try {
      prettyBody = JSON.stringify(JSON.parse(response.body), null, 2);
    } catch {}
  }

  const noBody = ["GET", "HEAD"].includes(method);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          📡 API Request Tester
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          A lightweight Postman — send requests to any public API and inspect the response. Requests are proxied through our server to avoid CORS, and private/internal addresses are blocked.
        </p>
      </div>

      {/* Request bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex gap-2">
          <div className="w-36 flex-shrink-0">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input-light font-mono font-semibold"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="https://api.example.com/endpoint"
            spellCheck={false}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={send}
            disabled={sending}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {sending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {sending ? "Sending…" : "Send"}
          </button>
          <button
            onClick={resetAll}
            title="Clear everything and start over"
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 text-sm font-semibold transition-colors"
          >
            ↺ Clear
          </button>
        </div>

        {/* Panel tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
          {[
            { key: "headers", label: `Headers${headers.filter((h) => h.key.trim()).length ? ` (${headers.filter((h) => h.key.trim()).length})` : ""}` },
            { key: "body", label: "Body", disabled: noBody },
            { key: "auth", label: `Auth${authType !== "none" ? " ●" : ""}` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => !t.disabled && setPanel(t.key)}
              disabled={t.disabled}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition disabled:opacity-30 disabled:cursor-not-allowed ${
                panel === t.key
                  ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
                  : "text-slate-500 dark:text-slate-400 border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Headers panel */}
        {panel === "headers" && (
          <KeyValueEditor rows={headers} onChange={setHeaders} keyPlaceholder="Header-Name" />
        )}

        {/* Auth panel */}
        {panel === "auth" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              {[
                { key: "none", label: "No Auth" },
                { key: "bearer", label: "Bearer Token" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setAuthType(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    authType === t.key
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {authType === "bearer" && (
              <div>
                <input
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Paste JWT / access token…"
                  spellCheck={false}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Sent as <code>Authorization: Bearer &lt;token&gt;</code> — overrides any manual Authorization header.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Body panel */}
        {panel === "body" && !noBody && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {BODY_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setBodyType(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    bodyType === t.key
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {bodyType === "raw" ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-end">
                  <button onClick={formatBody} className="text-[10px] text-slate-400 hover:text-indigo-500">
                    Format JSON
                  </button>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{ "key": "value" }'
                  spellCheck={false}
                  rows={6}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            ) : (
              <KeyValueEditor rows={formFields} onChange={setFormFields} />
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-200 dark:border-red-500/20">
          ✗ {error}
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center flex-wrap gap-2">
            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${statusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-xs text-slate-400">{response.timeMs} ms</span>
            <span className="text-xs text-slate-400">{(response.sizeBytes / 1024).toFixed(1)} KB</span>
            {response.truncated && (
              <span className="text-xs text-amber-500">⚠ truncated to 2MB</span>
            )}
          </div>

          <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
            {["body", "headers"].map((t) => (
              <button
                key={t}
                onClick={() => setRespTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition ${
                  respTab === t
                    ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
                    : "text-slate-500 dark:text-slate-400 border-transparent"
                }`}
              >
                {t === "body" ? "Body" : `Headers (${Object.keys(response.headers).length})`}
              </button>
            ))}
            <button
              onClick={() => copy(respTab === "body" ? prettyBody : JSON.stringify(response.headers, null, 2))}
              className="ml-auto text-xs px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
            >
              📋 Copy
            </button>
          </div>

          {respTab === "body" ? (
            <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 font-mono text-xs overflow-auto max-h-96 whitespace-pre-wrap break-words">
              {prettyBody || <span className="text-slate-400 italic">(empty body)</span>}
            </pre>
          ) : (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 divide-y divide-slate-200 dark:divide-white/5 max-h-96 overflow-auto">
              {Object.entries(response.headers).map(([k, v]) => (
                <div key={k} className="px-4 py-2 flex gap-3 text-xs font-mono">
                  <span className="text-indigo-500 flex-shrink-0">{k}:</span>
                  <span className="text-slate-600 dark:text-slate-300 break-all">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            Recent Requests
          </label>
          <div className="glass-card divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(h)}
                className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition"
              >
                <span className="text-[10px] font-bold text-indigo-500 w-16 flex-shrink-0">{h.method}</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 truncate font-mono">{h.url}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
