"""
Firebase Cloud Messaging (FCM) service.

Setup:
  1. Go to Firebase Console → Project Settings → Service Accounts
  2. Click "Generate new private key" → save as server/firebase-service-account.json
  3. Set FIREBASE_CREDENTIALS=./firebase-service-account.json in your .env
  4. Set FIREBASE_PROJECT_ID=your-project-id in your .env

Until credentials are provided, all send_* calls are no-ops (logged, not raised).
"""
import os, json, logging
from pathlib import Path

log = logging.getLogger(__name__)

_app = None  # firebase_admin.App, initialized lazily

APP_URL = os.getenv("APP_URL", "https://ai-devquiz.netlify.app")

def _init():
    global _app
    if _app is not None:
        return True
    try:
        import firebase_admin
        from firebase_admin import credentials

        # Priority 1: JSON string in env var (Render / cloud deploy)
        creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if creds_json:
            cred = credentials.Certificate(json.loads(creds_json))
            _app = firebase_admin.initialize_app(cred)
            log.info("FCM: Firebase Admin initialized from env var")
            return True

        # Priority 2: local file path
        creds_path = os.getenv("FIREBASE_CREDENTIALS", str(Path(__file__).parent.parent / "firebase-service-account.json"))
        if Path(creds_path).exists():
            cred = credentials.Certificate(creds_path)
            _app = firebase_admin.initialize_app(cred)
            log.info("FCM: Firebase Admin initialized from file")
            return True

        log.warning("FCM: no credentials found — push notifications disabled")
        return False
    except Exception as e:
        log.warning(f"FCM: init failed — {e}")
        return False


async def send_to_tokens(tokens: list[str], title: str, body: str, data: dict | None = None) -> int:
    """Send FCM notification to a list of device tokens. Returns sent count."""
    if not tokens:
        return 0
    if not _init():
        log.info(f"FCM (disabled) → {len(tokens)} tokens: {title}")
        return 0
    try:
        from firebase_admin import messaging
        path = "/" + str((data or {}).get("path", "/")).lstrip("/")
        link = f"{APP_URL}{path}"
        msgs = [
            messaging.Message(
                notification=messaging.Notification(title=title, body=body),
                data={k: str(v) for k, v in (data or {}).items()},
                android=messaging.AndroidConfig(
                    priority="high",
                    notification=messaging.AndroidNotification(
                        sound="notification_sound",
                        channel_id="devquiz_default",
                        icon="ic_launcher",
                    ),
                ),
                apns=messaging.APNSConfig(
                    headers={"apns-priority": "10"},
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(sound="notification_sound.mp3"),
                    ),
                ),
                webpush=messaging.WebpushConfig(
                    headers={"Urgency": "high"},
                    notification=messaging.WebpushNotification(
                        title=title,
                        body=body,
                        icon="/logo192.png",
                        badge="/logo192.png",
                        vibrate=[200, 100, 200],
                    ),
                    fcm_options=messaging.WebpushFCMOptions(link=link),
                ),
                token=token,
            )
            for token in tokens
        ]
        batch_size = 500  # FCM limit per batch
        sent = 0
        stale_tokens: list[str] = []
        for i in range(0, len(msgs), batch_size):
            batch_tokens = tokens[i:i+batch_size]
            resp = messaging.send_each(msgs[i:i+batch_size])
            sent += resp.success_count
            # Collect tokens that are invalid/unregistered so we can prune them
            for j, r in enumerate(resp.responses):
                if not r.success and r.exception:
                    code = getattr(r.exception, "code", "") or ""
                    if "UNREGISTERED" in str(code) or "INVALID_ARGUMENT" in str(code) or "NOT_FOUND" in str(code):
                        stale_tokens.append(batch_tokens[j])
        # Prune stale tokens asynchronously (fire-and-forget via asyncio)
        if stale_tokens:
            import asyncio
            asyncio.ensure_future(_prune_stale_tokens(stale_tokens))
        return sent
    except Exception as e:
        log.error(f"FCM send error: {e}")
        return 0


async def _prune_stale_tokens(tokens: list[str]):
    """Remove invalid/unregistered FCM tokens from MongoDB."""
    try:
        from db_mongo import col_fcm_tokens
        result = await col_fcm_tokens().delete_many({"token": {"$in": tokens}})
        if result.deleted_count:
            log.info(f"FCM: pruned {result.deleted_count} stale token(s)")
    except Exception as e:
        log.warning(f"FCM: failed to prune stale tokens — {e}")


async def send_to_all(title: str, body: str, data: dict | None = None) -> int:
    """Send to all registered device tokens (MongoDB)."""
    from db_mongo import col_fcm_tokens
    rows   = await col_fcm_tokens().find({}).to_list(length=1000)
    tokens = [r["token"] for r in rows]
    return await send_to_tokens(tokens, title, body, data)


async def send_to_user(user_id: str, title: str, body: str, data: dict | None = None) -> int:
    """Send to a specific user's registered devices (MongoDB)."""
    from db_mongo import col_fcm_tokens
    rows   = await col_fcm_tokens().find({"userId": user_id}).to_list(length=100)
    tokens = [r["token"] for r in rows]
    return await send_to_tokens(tokens, title, body, data)