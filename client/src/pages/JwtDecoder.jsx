import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const CLAIM_LABELS = {
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expires At",
  nbf: "Not Before",
  iat: "Issued At",
  jti: "JWT ID",
};

function b64UrlDecode(str) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  try {
    return decodeURIComponent(
      bin.split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""),
    );
  } catch {
    return bin;
  }
}

function b64UrlToBytes(str) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function fmtTime(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

const HMAC_ALGOS = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE);
  const [secret, setSecret] = useState("");
  const [verifyResult, setVerifyResult] = useState(null); // null | "valid" | "invalid" | "unsupported"
  const [verifying, setVerifying] = useState(false);

  const { header, payload, signature, error } = useMemo(() => {
    setVerifyResult(null);
    const parts = token.trim().split(".");
    if (parts.length !== 3) return { header: null, payload: null, signature: "", error: "A JWT must have 3 dot-separated parts (header.payload.signature)" };
    try {
      const header = JSON.parse(b64UrlDecode(parts[0]));
      const payload = JSON.parse(b64UrlDecode(parts[1]));
      return { header, payload, signature: parts[2], error: "" };
    } catch (e) {
      return { header: null, payload: null, signature: "", error: "Failed to decode: " + e.message };
    }
  }, [token]);

  const now = Math.floor(Date.now() / 1000);
  const isExpired = payload?.exp && payload.exp < now;
  const notYetValid = payload?.nbf && payload.nbf > now;

  const verify = async () => {
    if (!header || !secret) return;
    const algo = HMAC_ALGOS[header.alg];
    if (!algo) {
      setVerifyResult("unsupported");
      return;
    }
    setVerifying(true);
    try {
      const parts = token.trim().split(".");
      const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: algo },
        false,
        ["sign"],
      );
      const sigBuf = await crypto.subtle.sign("HMAC", key, data);
      const computed = new Uint8Array(sigBuf);
      const expected = b64UrlToBytes(signature);
      const match = computed.length === expected.length && computed.every((b, i) => b === expected[i]);
      setVerifyResult(match ? "valid" : "invalid");
    } catch {
      setVerifyResult("invalid");
    }
    setVerifying(false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          🔑 JWT Decoder
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Decode and inspect JSON Web Tokens. Nothing is sent to a server — decoding happens entirely in your browser.
        </p>
      </div>

      {/* Token input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            Encoded Token
          </label>
          <button
            onClick={() => setToken(SAMPLE)}
            className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
          >
            Sample
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          spellCheck={false}
          rows={4}
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 resize-none break-all"
        />
        {error && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-lg border border-red-200 dark:border-red-500/20">
            ✗ {error}
          </div>
        )}
      </div>

      {header && payload && (
        <>
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              alg: {header.alg}
            </span>
            {payload.exp && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isExpired ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`}>
                {isExpired ? "⛔ Expired" : "✓ Not expired"}
              </span>
            )}
            {notYetValid && (
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                ⏳ Not yet valid
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-red-500 uppercase tracking-wide">
                  Header
                </label>
                <button onClick={() => copy(JSON.stringify(header, null, 2))} className="text-[10px] text-slate-400 hover:text-indigo-500">
                  📋 Copy
                </button>
              </div>
              <pre className="p-4 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 text-slate-700 dark:text-slate-200 font-mono text-xs overflow-x-auto">
{JSON.stringify(header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-violet-500 uppercase tracking-wide">
                  Payload
                </label>
                <button onClick={() => copy(JSON.stringify(payload, null, 2))} className="text-[10px] text-slate-400 hover:text-indigo-500">
                  📋 Copy
                </button>
              </div>
              <pre className="p-4 rounded-xl border border-violet-200 dark:border-violet-500/20 bg-violet-50/50 dark:bg-violet-500/5 text-slate-700 dark:text-slate-200 font-mono text-xs overflow-x-auto">
{JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Standard claims */}
          {Object.keys(CLAIM_LABELS).some((k) => payload[k] !== undefined) && (
            <div className="glass-card divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
              {Object.entries(CLAIM_LABELS).map(([key, label]) =>
                payload[key] !== undefined ? (
                  <div key={key} className="p-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      {label} <span className="font-mono text-[10px] text-slate-400">({key})</span>
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-200">
                      {["exp", "nbf", "iat"].includes(key) ? fmtTime(payload[key]) : String(payload[key])}
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          )}

          {/* Signature verification */}
          <div className="glass-card p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Verify Signature (HMAC only — HS256/384/512)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={secret}
                onChange={(e) => { setSecret(e.target.value); setVerifyResult(null); }}
                placeholder="Enter the secret key…"
                spellCheck={false}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={verify}
                disabled={!secret || verifying}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {verifying ? "…" : "Verify"}
              </button>
            </div>
            {verifyResult === "valid" && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                ✓ Signature is valid
              </div>
            )}
            {verifyResult === "invalid" && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-lg border border-red-200 dark:border-red-500/20">
                ✗ Signature does not match
              </div>
            )}
            {verifyResult === "unsupported" && (
              <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2.5 rounded-lg border border-amber-200 dark:border-amber-500/20">
                ⚠ "{header.alg}" isn't a supported algorithm for in-browser verification (only HS256/384/512 are)
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
