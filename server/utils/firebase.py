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
        msgs = [
            messaging.Message(
                notification=messaging.Notification(title=title, body=body),
                data={k: str(v) for k, v in (data or {}).items()},
                token=token,
            )
            for token in tokens
        ]
        batch_size = 500  # FCM limit per batch
        sent = 0
        for i in range(0, len(msgs), batch_size):
            resp = messaging.send_each(msgs[i:i+batch_size])
            sent += resp.success_count
        return sent
    except Exception as e:
        log.error(f"FCM send error: {e}")
        return 0


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
