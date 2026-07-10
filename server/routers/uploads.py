"""
Generic image upload endpoint used by Profile pictures and Notes' AI-writing
image embeds. Uploads to Cloudinary and returns only the URL — the database
never stores raw image bytes, keeping documents small regardless of image size.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from deps import current_user
from utils.cloudinary_client import upload_image_bytes, is_configured

router = APIRouter()

MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"}


@router.post("/image")
async def upload_image(file: UploadFile = File(...), user=Depends(current_user)):
    if not is_configured():
        raise HTTPException(503, "Image uploads are not configured yet — ask the admin to add Cloudinary credentials.")
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(400, f"Unsupported file type '{file.content_type}'. Use PNG, JPEG, WEBP, or GIF.")

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Image too large — max 5MB.")

    url = upload_image_bytes(data, folder=f"devquiz/{user['id']}", is_gif=(file.content_type == "image/gif"))
    return {"url": url}
