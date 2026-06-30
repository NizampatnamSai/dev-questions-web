import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyANlzRxM4nOUA3TkUxvx4Yp1JjI_FyirGE",
  authDomain: "ai-questions-889d2.firebaseapp.com",
  projectId: "ai-questions-889d2",
  storageBucket: "ai-questions-889d2.firebasestorage.app",
  messagingSenderId: "794467830267",
  appId: "1:794467830267:web:89e39e4302e2a4ed1e235e",
  measurementId: "G-HKLB55WT6V",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

// VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY ?? "";

const FCM_TOKEN_KEY = "devquiz_fcm_token";

export async function requestAndRegisterToken(apiClient) {
  try {
    if (localStorage.getItem("devquiz_guest") === "1") {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    // Register SW then wait for it to become active — getToken fails if SW isn't active yet
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );
    await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token && apiClient) {
      const cached = localStorage.getItem(FCM_TOKEN_KEY);
      // Always register; backend does upsert so re-registering same token is safe
      await apiClient.post("/admin/fcm-token", { token, platform: "web" });
      if (cached !== token) {
        localStorage.setItem(FCM_TOKEN_KEY, token);
      }
    }
    return token;
  } catch (e) {
    console.warn("FCM web token registration failed:", e);
    return null;
  }
}

export function onForegroundMessage(callback) {
  return onMessage(messaging, callback);
}
