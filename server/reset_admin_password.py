"""
Run once to change admin password and invalidate all admin FCM tokens (forces re-login).
Usage:  python reset_admin_password.py
"""
import asyncio, bcrypt, os
from dotenv import load_dotenv
load_dotenv()
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME   = os.getenv("MONGO_DB", "devquiz")
NEW_PASSWORD = "Admin@777"

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    hashed = bcrypt.hashpw(NEW_PASSWORD[:72].encode(), bcrypt.gensalt()).decode()

    result = await db["users"].update_many(
        {"role": {"$in": ["admin", "sub_admin"]}},
        {"$set": {"password": hashed}}
    )
    print(f"✅ Password updated for {result.modified_count} admin(s) → {NEW_PASSWORD}")

    # Remove FCM tokens for all admins so they must log in again
    admins = await db["users"].find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20)
    for admin in admins:
        uid = str(admin["_id"])
        r = await db["fcm_tokens"].delete_many({"userId": uid})
        print(f"   🔑 Cleared {r.deleted_count} FCM token(s) for {admin.get('name')}")

    print("✅ All admin sessions invalidated. Admins must log in again.")
    client.close()

asyncio.run(main())
