"""Personal encrypted notes. The server NEVER sees plaintext and NEVER derives
or stores an encryption key — it only stores opaque ciphertext blobs plus a
random per-user salt. All encryption/decryption happens in the browser via the
Web Crypto API, keyed by a passphrase the user sets that is never transmitted.
There is deliberately no admin override, no master key, and no recovery path —
if a user forgets their notes passphrase, their notes are unrecoverable by
design. That's the whole point: not even an admin with full DB access can read
another user's notes."""
import os
import base64
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_notes, col_note_keys, oid, now
from deps import current_user

router = APIRouter()


@router.get("/salt")
async def get_or_create_salt(user=Depends(current_user)):
    """Every user's salt is generated once, server-side (for good randomness),
    and is not secret — it just needs to be consistent so the same passphrase
    always derives the same key. verifyCipher (if set) lets the client confirm
    a passphrase is correct before trusting it against real notes."""
    doc = await col_note_keys().find_one({"userId": user["id"]})
    if not doc:
        salt = base64.b64encode(os.urandom(16)).decode()
        await col_note_keys().update_one(
            {"userId": user["id"]},
            {"$setOnInsert": {"userId": user["id"], "salt": salt, "createdAt": now()}},
            upsert=True,
        )
        doc = await col_note_keys().find_one({"userId": user["id"]})
    return {
        "salt": doc["salt"],
        "verifyCipher": doc.get("verifyCipher"),
        "verifyIv": doc.get("verifyIv"),
    }


class VerifySetupBody(BaseModel):
    cipher: str
    iv: str


@router.post("/verify-setup")
async def set_verification_blob(body: VerifySetupBody, user=Depends(current_user)):
    """Stores the one-time 'canary' ciphertext used to confirm a passphrase is
    correct on future unlocks. Only settable once — changing your passphrase
    later means re-encrypting everything client-side and calling this again."""
    await col_note_keys().update_one(
        {"userId": user["id"]},
        {"$set": {"verifyCipher": body.cipher, "verifyIv": body.iv}},
    )
    return {"ok": True}


class NoteBody(BaseModel):
    titleCipher: str
    titleIv: str
    bodyCipher: str
    bodyIv: str


def _fmt(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "titleCipher": doc["titleCipher"],
        "titleIv": doc["titleIv"],
        "bodyCipher": doc["bodyCipher"],
        "bodyIv": doc["bodyIv"],
        "createdAt": doc["createdAt"].isoformat(),
        "updatedAt": doc["updatedAt"].isoformat(),
    }


@router.get("")
async def list_notes(user=Depends(current_user)):
    docs = await col_notes().find({"userId": user["id"]}).sort("createdAt", -1).to_list(2000)
    return [_fmt(d) for d in docs]


@router.post("")
async def create_note(body: NoteBody, user=Depends(current_user)):
    ts = now()
    doc = {
        "userId": user["id"],
        "titleCipher": body.titleCipher,
        "titleIv": body.titleIv,
        "bodyCipher": body.bodyCipher,
        "bodyIv": body.bodyIv,
        "createdAt": ts,
        "updatedAt": ts,
    }
    result = await col_notes().insert_one(doc)
    return _fmt({**doc, "_id": result.inserted_id})


@router.patch("/{note_id}")
async def update_note(note_id: str, body: NoteBody, user=Depends(current_user)):
    doc = await col_notes().find_one({"_id": oid(note_id)})
    if not doc:
        raise HTTPException(404, "Note not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not your note")
    update = {
        "titleCipher": body.titleCipher,
        "titleIv": body.titleIv,
        "bodyCipher": body.bodyCipher,
        "bodyIv": body.bodyIv,
        "updatedAt": now(),
    }
    await col_notes().update_one({"_id": oid(note_id)}, {"$set": update})
    return _fmt({**doc, **update})


@router.delete("/{note_id}")
async def delete_note(note_id: str, user=Depends(current_user)):
    doc = await col_notes().find_one({"_id": oid(note_id)})
    if not doc:
        raise HTTPException(404, "Note not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not your note")
    await col_notes().delete_one({"_id": oid(note_id)})
    return {"message": "Deleted"}
