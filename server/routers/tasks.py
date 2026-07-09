from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_tasks, col_task_comments, col_users, col_fcm_tokens, col_user_profiles, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _is_admin(user):
    return user.get("role") in ("admin", "sub_admin")


# Jira-style workflow: todo -> started -> testing -> completed
TASK_STATUSES = ("todo", "started", "testing", "completed")


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
    status: str  # todo | started | testing | completed


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


async def _enrich_tasks(docs: list) -> list:
    """Batched version of _enrich_task for list endpoints — one profile query
    covering every assignee across the whole list, instead of calling
    _enrich_task() (and its own $in query) once per task."""
    all_ids = list({a["id"] for d in docs for a in d.get("assignees", [])})
    profiles = await col_user_profiles().find({"userId": {"$in": all_ids}}).to_list(length=len(all_ids) or 1)
    avatar_map = {p["userId"]: p.get("avatar_url") for p in profiles}
    result = []
    for doc in docs:
        doc = sid(doc)
        assignees = doc.get("assignees", [])
        for a in assignees:
            a["avatar"] = avatar_map.get(a["id"])
        doc["assignees"] = assignees
        result.append(doc)
    return result


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
        "status":      "todo",
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

    # Notify all assignees except the creator — one batched query instead of
    # one per assignee. No point push-notifying an admin about a task they
    # just assigned to themselves.
    assignee_ids = [a["id"] for a in assignees if a["id"] != user["id"]]
    tokens_docs = await col_fcm_tokens().find({"userId": {"$in": assignee_ids}}).to_list(length=(len(assignee_ids) * 5) or 1)
    tokens = list({t["token"] for t in tokens_docs})
    if tokens:
        await send_to_tokens(
            tokens,
            "📋 New Task Assigned",
            f"{body.title} — assigned by {user.get('name', 'Admin')}",
            {"type": "task", "path": "/my-tasks"},
        )

    created = await col_tasks().find_one({"_id": result.inserted_id})
    return await _enrich_task(created)


# ── Admin: list all tasks ─────────────────────────────────────────────────────

@router.get("")
async def list_tasks(user=Depends(current_user)):
    if _is_admin(user):
        docs = await col_tasks().find({}).sort("createdAt", -1).to_list(500)
    else:
        docs = await col_tasks().find({"assigneeIds": user["id"]}).sort("createdAt", -1).to_list(200)
    return await _enrich_tasks(docs)


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

    # Notify newly added assignees, excluding the admin making the change —
    # same reasoning as create_task, no self-notification.
    old_ids = set(doc.get("assigneeIds", []))
    new_ids = ({a["id"] for a in assignees} - old_ids) - {user["id"]}
    if new_ids:
        new_ids_list = list(new_ids)
        tokens_docs = await col_fcm_tokens().find({"userId": {"$in": new_ids_list}}).to_list(length=(len(new_ids_list) * 5) or 1)
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
    if body.status not in TASK_STATUSES:
        raise HTTPException(400, f"Invalid status — must be one of {TASK_STATUSES}")

    # Regular assignees move through the workflow one stage at a time and can't
    # mark a task completed themselves — only an admin signs off on "completed".
    # They can still move a task backward (e.g. testing -> started) freely.
    if not _is_admin(user):
        if body.status == "completed":
            raise HTTPException(403, "Only an admin can mark a task as completed — add a comment if it's ready for review.")
        cur_idx = TASK_STATUSES.index(doc["status"]) if doc["status"] in TASK_STATUSES else 0
        new_idx = TASK_STATUSES.index(body.status)
        if new_idx > cur_idx + 1:
            raise HTTPException(400, "Move one stage at a time — you can't skip ahead.")

    update: dict = {"status": body.status, "updatedAt": now()}

    # Track who completed
    completed_by = doc.get("completedBy", [])
    if body.status == "completed" and user["id"] not in completed_by:
        completed_by.append(user["id"])
        update["completedBy"] = completed_by
    elif body.status != "completed":
        update["completedBy"] = [u for u in completed_by if u != user["id"]]

    await col_tasks().update_one({"_id": oid(task_id)}, {"$set": update})

    # Notify admin when user marks done
    if body.status == "completed" and not _is_admin(user):
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
    comment.pop("_id", None)  # insert_one mutates comment in place, adding a non-JSON-serializable ObjectId
    comment["id"] = str(result.inserted_id)

    # Notify other participants
    participants = set(doc.get("assigneeIds", []))
    participants.add(doc["createdBy"])
    participants.discard(user["id"])

    participant_ids = list(participants)
    tokens_docs = await col_fcm_tokens().find({"userId": {"$in": participant_ids}}).to_list(length=(len(participant_ids) * 5) or 1)
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
