// Extension picks localhost during local dev automatically by checking which
// host actually responds; defaults to production otherwise.
const API_CANDIDATES = ["http://localhost:8000/api", "https://dev-questions-web.onrender.com/api"];

const $ = (id) => document.getElementById(id);

let API_BASE = null;
let pendingClip = null;

async function resolveApiBase() {
  const { apiBase } = await chrome.storage.local.get("apiBase");
  if (apiBase) return apiBase;
  for (const base of API_CANDIDATES) {
    try {
      const r = await fetch(`${base.replace(/\/api$/, "")}/health`, { signal: AbortSignal.timeout(800) });
      if (r.ok) return base;
    } catch {}
  }
  return API_CANDIDATES[1]; // fall back to production
}

async function getToken() {
  const { devquiz_ext_token } = await chrome.storage.local.get("devquiz_ext_token");
  return devquiz_ext_token || null;
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

function showView(view) {
  $("loginView").style.display = view === "login" ? "block" : "none";
  $("saveView").style.display = view === "save" ? "block" : "none";
  $("logoutBtn").style.display = view === "save" ? "inline" : "none";
}

async function init() {
  API_BASE = await resolveApiBase();

  const { pendingClip: clip } = await chrome.storage.local.get("pendingClip");
  pendingClip = clip || null;
  chrome.action.setBadgeText({ text: "" });

  const token = await getToken();
  if (!token) {
    showView("login");
    return;
  }
  showView("save");
  fillClip();
}

function fillClip() {
  if (pendingClip) {
    $("clipText").value = pendingClip.text || "";
    $("clipTitle").value = pendingClip.title ? `Clip: ${pendingClip.title}`.slice(0, 80) : "Clipped note";
    $("clipMeta").textContent = `From ${pendingClip.url} — ${new Date(pendingClip.timestamp).toLocaleString()}`;
  } else {
    $("clipTitle").value = "New note";
    $("clipMeta").textContent = "No selection captured — right-click selected text on any page and choose 'Save to DevQuiz Notes', or just type/paste below.";
  }
}

$("loginBtn").addEventListener("click", async () => {
  $("loginError").textContent = "";
  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;
  if (!email || !password) {
    $("loginError").textContent = "Enter email and password";
    return;
  }
  $("loginBtn").disabled = true;
  try {
    const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    await chrome.storage.local.set({ devquiz_ext_token: data.token });
    showView("save");
    fillClip();
  } catch (err) {
    $("loginError").textContent = err.message;
  } finally {
    $("loginBtn").disabled = false;
  }
});

$("logoutBtn").addEventListener("click", async () => {
  await chrome.storage.local.remove("devquiz_ext_token");
  showView("login");
});

$("saveBtn").addEventListener("click", async () => {
  $("saveError").textContent = "";
  $("saveSuccess").textContent = "";

  const text = $("clipText").value.trim();
  const title = $("clipTitle").value.trim() || "Untitled clip";
  const passphrase = $("passphrase").value;
  const importance = $("clipImportance").value;

  if (!text) return ($("saveError").textContent = "Nothing to save — select some text first");
  if (!passphrase) return ($("saveError").textContent = "Enter your Notes passphrase");

  $("saveBtn").disabled = true;
  try {
    const { salt, verifyCipher, verifyIv } = await apiFetch("/notes/salt");
    if (!verifyCipher) {
      throw new Error("Set up your Notes passphrase in the DevQuiz web app first, then come back here.");
    }
    const key = await unlockWithPassphrase(passphrase, salt, verifyCipher, verifyIv);

    const importanceLabel = { low: "🟢 Low", medium: "🟡 Medium", high: "🔴 High" }[importance];
    const meta = pendingClip
      ? `<p><em>📌 Clipped from <a href="${pendingClip.url}">${pendingClip.url}</a> — ${new Date(pendingClip.timestamp).toLocaleString()} — Importance: ${importanceLabel}</em></p>`
      : `<p><em>📌 Saved via browser extension — ${new Date().toLocaleString()} — Importance: ${importanceLabel}</em></p>`;
    const bodyHtml = `${meta}<p>${text.replace(/\n/g, "<br>")}</p>`;

    const titleEnc = await encryptText(key, title);
    const bodyEnc = await encryptText(key, bodyHtml);

    await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify({
        titleCipher: titleEnc.cipher, titleIv: titleEnc.iv,
        bodyCipher: bodyEnc.cipher, bodyIv: bodyEnc.iv,
      }),
    });

    await chrome.storage.local.remove("pendingClip");
    $("saveSuccess").textContent = "Saved! Check your Notes in the DevQuiz app.";
    $("passphrase").value = "";
    setTimeout(() => window.close(), 1200);
  } catch (err) {
    $("saveError").textContent = err.message.includes("Wrong") || err.message.includes("decrypt")
      ? "Wrong passphrase — try again."
      : err.message;
  } finally {
    $("saveBtn").disabled = false;
  }
});

init();
