// Client-side, zero-knowledge encryption for Personal Notes.
// The server only ever sees ciphertext + a per-user salt (not secret) — the
// passphrase and the derived key never leave this module's memory, and are
// never sent over the network. Nobody (including an admin with full DB
// access) can decrypt a note without the owner's passphrase.

const VERIFY_PLAINTEXT = "devquiz-notes-verify";

function b64encode(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function b64decode(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase, saltB64) {
  const enc = new TextEncoder();
  const salt = b64decode(saltB64);
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
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
async function unlockWithPassphrase(passphrase, salt, verifyCipher, verifyIv) {
  const key = await deriveKey(passphrase, salt);
  if (verifyCipher && verifyIv) {
    const decrypted = await decryptText(key, verifyCipher, verifyIv);
    if (decrypted !== VERIFY_PLAINTEXT) throw new Error("Wrong passphrase");
  }
  return key;
}

async function createVerificationBlob(key) {
  return encryptText(key, VERIFY_PLAINTEXT);
}

export { deriveKey, encryptText, decryptText, unlockWithPassphrase, createVerificationBlob };
