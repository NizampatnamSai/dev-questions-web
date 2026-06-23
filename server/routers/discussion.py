from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_comments, col_questions, sid, oid, now
from deps import current_user

router = APIRouter()


class CommentCreate(BaseModel):
    question_id: str
    text: str
    parent_id: str = None  # For nested replies


class CommentUpdate(BaseModel):
    text: str


@router.post("/questions/{question_id}/comments")
async def create_comment(question_id: str, body: CommentCreate, user=Depends(current_user)):
    """Create a comment on a question"""
    question = await col_questions().find_one({"_id": oid(question_id)})
    if not question:
        raise HTTPException(404, "Question not found")

    comment_doc = {
        "questionId": question_id,
        "userId": user["id"],
        "userName": user.get("name", "Anonymous"),
        "userAvatar": None,
        "text": body.text.strip(),
        "parentId": body.parent_id,
        "votes": 0,
        "isVoted": False,
        "replies": [],
        "createdAt": now(),
        "updatedAt": now(),
    }

    result = await col_comments().insert_one(comment_doc)

    # Update question comment count
    await col_questions().update_one(
        {"_id": oid(question_id)},
        {"$inc": {"commentCount": 1}}
    )

    return sid({**comment_doc, "_id": result.inserted_id})


@router.get("/questions/{question_id}/comments")
async def get_comments(question_id: str, limit: int = 50, offset: int = 0):
    """Get comments for a question"""
    comments = await col_comments().find(
        {"questionId": question_id, "parentId": None}
    ).sort("createdAt", -1).skip(offset).limit(limit).to_list(limit)

    return [sid(c) for c in comments]


@router.patch("/comments/{comment_id}")
async def update_comment(comment_id: str, body: CommentUpdate, user=Depends(current_user)):
    """Update a comment (owner only)"""
    comment = await col_comments().find_one({"_id": oid(comment_id)})
    if not comment:
        raise HTTPException(404, "Comment not found")

    if comment["userId"] != user["id"] and user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Cannot edit this comment")

    await col_comments().update_one(
        {"_id": oid(comment_id)},
        {"$set": {"text": body.text.strip(), "updatedAt": now()}}
    )

    return {"message": "Comment updated"}


@router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, user=Depends(current_user)):
    """Delete a comment (owner or admin only)"""
    comment = await col_comments().find_one({"_id": oid(comment_id)})
    if not comment:
        raise HTTPException(404, "Comment not found")

    if comment["userId"] != user["id"] and user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Cannot delete this comment")

    await col_comments().delete_one({"_id": oid(comment_id)})

    # Update question comment count
    await col_questions().update_one(
        {"_id": oid(comment["questionId"])},
        {"$inc": {"commentCount": -1}}
    )

    return {"message": "Comment deleted"}


@router.post("/comments/{comment_id}/vote")
async def vote_comment(comment_id: str, user=Depends(current_user)):
    """Vote on a comment (upvote/toggle)"""
    comment = await col_comments().find_one({"_id": oid(comment_id)})
    if not comment:
        raise HTTPException(404, "Comment not found")

    voted_users = comment.get("votedUsers", [])
    if user["id"] in voted_users:
        voted_users.remove(user["id"])
        votes = comment.get("votes", 1) - 1
    else:
        voted_users.append(user["id"])
        votes = comment.get("votes", 0) + 1

    await col_comments().update_one(
        {"_id": oid(comment_id)},
        {"$set": {"votes": votes, "votedUsers": voted_users}}
    )

    return {"votes": votes, "voted": user["id"] in voted_users}
