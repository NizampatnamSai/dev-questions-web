from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_tasks, col_task_comments, col_users, col_fcm_tokens, col_user_profiles, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _is_admin(user):
    return user.get("role") in ("admin", "sub_admin")


# ── Models ────────────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    assigneeIds: List[str]
    priority: str = "medium"   # low | medium | high
    dueDate: Optional[str] = None  # ISO string or None

class TaskComment(BaseModel):
    text: str

class StatusUpdate(BaseModel):
    status: str  # open | in_progress | done


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _enrich_task(doc: dict) -> dict:
    doc = sid(doc)
    # Attach avatar for each assignee
    assignees = doc.get("assignees", [])
    user_ids = [a["id"] for a in assignees]
    profiles = await col_user_profiles().find({"userId": {"$in": user_ids}}).to_list(100)
    avatar_map = {p["userId"]: p.get("avatar_url") for p in profiles}
    for a in assignees:
        a["avatar"] = avatar_map.get(a["id"])
    doc["assignees"] = assignees
    return doc


# ── Admin: create task ────────────────────────────────────────────────────────

@router.post("")
async def create_task(body: TaskCreate, user=Depends(current_user)):
    if not _is_admin(user):
        raise HTTPException(403, "Admins only")
    if not body.assigneeIds:
        raise HTTPException(400, "Must assign to at least one user")

    # Resolve assignee names
    assignees = []
    for uid in body.assigneeIds:
        try:
            u = await col_users().find_one({"_id": oid(uid)})
            if u:
                assignees.append({"id": uid, "name": u.get("name", "Unknown")})
        except Exception:
            pass

    if not assignees:
        raise HTTPException(400, "No valid users found")

    doc = {
        "title":       body.title,
        "description": body.description,
        "priority":    body.priority,
        "dueDate":     body.dueDate,
        "status":      "open",
        "assignees":   assignees,
        "assigneeIds": [a["id"] for a in assignees],
        "createdBy":   user["id"],
        "createdByName": user.get("name", "Admin"),
        "createdAt":   now(),
        "updatedAt":   now(),
        "completedBy": [],   # list of userIds who marked done
    }
    result = await col_tasks().insert_one(doc)
    task_id = str(result.inserted_id)

    # Notify all assignees
    tokens_docs = []
    for uid in [a["id"] for a in assignees]:
        tokens_docs += await col_fcm_tokens().find({"userId": uid}).to_list(5)
    tokens = list({t["token"] for t in tokens_docs})
    if tokens:
        await send_to_tokens(
            tokens,
            "📋 New Task Assigned",
            f"{body.title} — assigned by {user.get('name', 'Admin')}",
            {"type": "task", "path": "/my-tasks"},
        )

    doc["_id"] = task_id
    return doc


# ── Admin: list all tasks ─────────────────────────────────────────────────────

@router.get("")
async def list_tasks(user=Depends(current_user)):
    if _is_admin(user):
        docs = await col_tasks().find({}).sort("createdAt", -1).to_list(500)
    else:
        docs = await col_tasks().find({"assigneeIds": user["id"]}).sort("createdAt", -1).to_list(200)
    return [await _enrich_task(d) for d in docs]


# ── Get single task ───────────────────────────────────────────────────────────

@router.get("/{task_id}")
async def get_task(task_id: str, user=Depends(current_user)):
    doc = await col_tasks().find_one({"_id": oid(task_id)})
    if not doc:
        raise HTTPException(404, "Task not found")
    if not _is_admin(user) and user["id"] not in doc.get("assigneeIds", []):
        raise HTTPException(403, "Not assigned to you")
    return await _enrich_task(doc)


# ── Admin: delete task ────────────────────────────────────────────────────────

@router.delete("/{task_id}")
async def delete_task(task_id: str, user=Depends(current_user)):
    if not _is_admin(user):
        raise HTTPException(403, "Admins only")
    await col_tasks().delete_one({"_id": oid(task_id)})
    await col_task_comments().delete_many({"taskId": task_id})
    return {"ok": True}


# ── Admin: edit task ──────────────────────────────────────────────────────────

@router.patch("/{task_id}")
async def update_task(task_id: str, body: TaskCreate, user=Depends(current_user)):
    if not _is_admin(user):
        raise HTTPException(403, "Admins only")
    doc = await col_tasks().find_one({"_id": oid(task_id)})
    if not doc:
        raise HTTPException(404, "Task not found")

    assignees = []
    for uid in body.assigneeIds:
        try:
            u = await col_users().find_one({"_id": oid(uid)})
            if u:
                assignees.append({"id": uid, "name": u.get("name", "Unknown")})
        except Exception:
            pass

    # Notify newly added assignees
    old_ids = set(doc.get("assigneeIds", []))
    new_ids = {a["id"] for a in assignees} - old_ids
    if new_ids:
        tokens_docs = []
        for uid in new_ids:
            tokens_docs += await col_fcm_tokens().find({"userId": uid}).to_list(5)
        tokens = list({t["token"] for t in tokens_docs})
        if tokens:
            await send_to_tokens(
                tokens,
                "📋 Task Assigned to You",
                f"{body.title} — assigned by {user.get('name', 'Admin')}",
                {"type": "task", "path": "/my-tasks"},
            )

    await col_tasks().update_one({"_id": oid(task_id)}, {"$set": {
        "title":       body.title,
        "description": body.description,
        "priority":    body.priority,
        "dueDate":     body.dueDate,
        "assignees":   assignees,
        "assigneeIds": [a["id"] for a in assignees],
        "updatedAt":   now(),
    }})
    updated = await col_tasks().find_one({"_id": oid(task_id)})
    return await _enrich_task(updated)


# ── User/Admin: update status ─────────────────────────────────────────────────

@router.patch("/{task_id}/status")
async def update_status(task_id: str, body: StatusUpdate, user=Depends(current_user)):
    doc = await col_tasks().find_one({"_id": oid(task_id)})
    if not doc:
        raise HTTPException(404, "Task not found")
    if not _is_admin(user) and user["id"] not in doc.get("assigneeIds", []):
        raise HTTPException(403, "Not assigned to you")
    if body.status not in ("open", "in_progress", "done"):
        raise HTTPException(400, "Invalid status")

    update: dict = {"status": body.status, "updatedAt": now()}

    # Track who completed
    completed_by = doc.get("completedBy", [])
    if body.status == "done" and user["id"] not in completed_by:
        completed_by.append(user["id"])
        update["completedBy"] = completed_by
    elif body.status != "done":
        update["completedBy"] = [u for u in completed_by if u != user["id"]]

    await col_tasks().update_one({"_id": oid(task_id)}, {"$set": update})

    # Notify admin when user marks done
    if body.status == "done" and not _is_admin(user):
        tokens_docs = await col_fcm_tokens().find({"userId": doc["createdBy"]}).to_list(5)
        tokens = [t["token"] for t in tokens_docs]
        if tokens:
            await send_to_tokens(
                tokens,
                "✅ Task Completed",
                f"{user.get('name')} completed: {doc['title']}",
                {"type": "task", "path": "/admin/tasks"},
            )

    updated = await col_tasks().find_one({"_id": oid(task_id)})
    return await _enrich_task(updated)


# ── Comments ──────────────────────────────────────────────────────────────────

@router.get("/{task_id}/comments")
async def get_comments(task_id: str, user=Depends(current_user)):
    doc = await col_tasks().find_one({"_id": oid(task_id)})
    if not doc:
        raise HTTPException(404, "Task not found")
    if not _is_admin(user) and user["id"] not in doc.get("assigneeIds", []):
        raise HTTPException(403, "Not assigned to you")
    comments = await col_task_comments().find({"taskId": task_id}).sort("createdAt", 1).to_list(500)
    # Attach avatars
    user_ids = list({c["userId"] for c in comments})
    profiles = await col_user_profiles().find({"userId": {"$in": user_ids}}).to_list(100)
    avatar_map = {p["userId"]: p.get("avatar_url") for p in profiles}
    result = []
    for c in comments:
        c = sid(c)
        c["avatar"] = avatar_map.get(c["userId"])
        result.append(c)
    return result


@router.post("/{task_id}/comments")
async def add_comment(task_id: str, body: TaskComment, user=Depends(current_user)):
    doc = await col_tasks().find_one({"_id": oid(task_id)})
    if not doc:
        raise HTTPException(404, "Task not found")
    if not _is_admin(user) and user["id"] not in doc.get("assigneeIds", []):
        raise HTTPException(403, "Not assigned to you")

    comment = {
        "taskId":    task_id,
        "userId":    user["id"],
        "userName":  user.get("name", "Unknown"),
        "text":      body.text.strip(),
        "createdAt": now(),
        "isAdmin":   _is_admin(user),
    }
    result = await col_task_comments().insert_one(comment)
    comment["id"] = str(result.inserted_id)

    # Notify other participants
    participants = set(doc.get("assigneeIds", []))
    participants.add(doc["createdBy"])
    participants.discard(user["id"])

    tokens_docs = []
    for uid in participants:
        tokens_docs += await col_fcm_tokens().find({"userId": uid}).to_list(5)
    tokens = list({t["token"] for t in tokens_docs})
    if tokens:
        await send_to_tokens(
            tokens,
            f"💬 {user.get('name', 'Someone')} commented",
            f"{doc['title']}: {body.text[:80]}",
            {"type": "task", "path": "/my-tasks" if not _is_admin(user) else "/admin/tasks"},
        )

    profile = await col_user_profiles().find_one({"userId": user["id"]})
    comment["avatar"] = profile.get("avatar_url") if profile else None
    return comment


@router.delete("/{task_id}/comments/{comment_id}")
async def delete_comment(task_id: str, comment_id: str, user=Depends(current_user)):
    c = await col_task_comments().find_one({"_id": oid(comment_id)})
    if not c:
        raise HTTPException(404, "Comment not found")
    if not _is_admin(user) and c["userId"] != user["id"]:
        raise HTTPException(403, "Not your comment")
    await col_task_comments().delete_one({"_id": oid(comment_id)})
    return {"ok": True}
