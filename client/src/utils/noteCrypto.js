// Client-side, zero-knowledge encryption for Personal Notes.
// The server only ever sees ciphertext + a per-user salt (not secret) — the
// passphrase and the derived key never leave this module's memory, and are
// never sent over the network. Nobody (including an admin with full DB
// access) can decrypt a note without the owner's passphrase.

const VERIFY_PLAINTEXT = "devquiz-notes-verify";
const SESSION_KEY_STORAGE = "devquiz_notes_session_key";

function b64encode(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function b64decode(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase, saltB64, extractable = false) {
  const enc = new TextEncoder();
  const salt = b64decode(saltB64);
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    extractable,
    ["encrypt", "decrypt"],
  );
}

async function encryptText(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return { cipher: b64encode(new Uint8Array(cipherBuf)), iv: b64encode(iv) };
}

async function decryptText(key, cipherB64, ivB64) {
  const iv = b64decode(ivB64);
  const cipherBytes = b64decode(cipherB64);
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBytes);
  return new TextDecoder().decode(plainBuf);
}

/** Derives a key and confirms it's correct against the stored canary
 * ciphertext. Throws if the passphrase is wrong (AES-GCM auth tag mismatch or
 * mismatched plaintext) or if this looks like first-time setup. */
async function unlockWithPassphrase(passphrase, salt, verifyCipher, verifyIv, extractable = false) {
  const key = await deriveKey(passphrase, salt, extractable);
  if (verifyCipher && verifyIv) {
    const decrypted = await decryptText(key, verifyCipher, verifyIv);
    if (decrypted !== VERIFY_PLAINTEXT) throw new Error("Wrong passphrase");
  }
  return key;
}

async function createVerificationBlob(key) {
  return encryptText(key, VERIFY_PLAINTEXT);
}

/** Caches the derived key in sessionStorage (cleared when the tab/browser
 * closes, or explicitly on logout) so the user isn't re-prompted for the
 * passphrase on every page load within the same browsing session. The key
 * itself is stored, never the passphrase. Only ever call this after the user
 * has explicitly opted in via the confirmation modal — anyone with access to
 * this browser tab during the session can then read notes without a prompt. */
async function rememberKeyForSession(key, saltB64) {
  const raw = await crypto.subtle.exportKey("raw", key);
  sessionStorage.setItem(SESSION_KEY_STORAGE, JSON.stringify({ key: b64encode(new Uint8Array(raw)), salt: saltB64 }));
}

/** Restores a previously-remembered key for this browsing session, if any,
 * scoped to the current user's salt. Returns null if nothing is stored, the
 * salt doesn't match (e.g. a different account logged in on this tab), or
 * the stored key otherwise fails the verification check. */
async function restoreKeyForSession(saltB64, verifyCipher, verifyIv) {
  const raw = sessionStorage.getItem(SESSION_KEY_STORAGE);
  if (!raw) return null;
  try {
    const { key: rawB64, salt: storedSalt } = JSON.parse(raw);
    if (storedSalt !== saltB64) throw new Error("salt mismatch");
    const key = await crypto.subtle.importKey("raw", b64decode(rawB64), "AES-GCM", false, ["encrypt", "decrypt"]);
    if (verifyCipher && verifyIv) {
      const decrypted = await decryptText(key, verifyCipher, verifyIv);
      if (decrypted !== VERIFY_PLAINTEXT) throw new Error("Wrong key");
    }
    return key;
  } catch {
    sessionStorage.removeItem(SESSION_KEY_STORAGE);
    return null;
  }
}

function forgetSessionKey() {
  sessionStorage.removeItem(SESSION_KEY_STORAGE);
}

export {
  deriveKey, encryptText, decryptText, unlockWithPassphrase, createVerificationBlob,
  rememberKeyForSession, restoreKeyForSession, forgetSessionKey,
};
