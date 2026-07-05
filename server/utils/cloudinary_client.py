"""
Thin Cloudinary wrapper — the only place that touches image storage. We only
ever store the URL Cloudinary returns in our own database; the image bytes
themselves live entirely on Cloudinary's free tier, never on our server.
"""
import os
import cloudinary
import cloudinary.uploader

_configured = False


def _ensure_configured():
    global _configured
    if _configured:
        return
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
        api_key=os.getenv("CLOUDINARY_API_KEY", ""),
        api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
    )
    _configured = True


def is_configured() -> bool:
    return bool(os.getenv("CLOUDINARY_CLOUD_NAME") and os.getenv("CLOUDINARY_API_KEY"))


def upload_image_bytes(data: bytes, folder: str) -> str:
    """Uploads raw image bytes to Cloudinary and returns the secure HTTPS URL."""
    _ensure_configured()
    result = cloudinary.uploader.upload(
        data,
        folder=folder,
        resource_type="image",
        # Cap dimensions server-side so a huge upload doesn't balloon storage —
        # Cloudinary resizes on upload, not just via URL transforms.
        transformation=[{"width": 1600, "height": 1600, "crop": "limit"}],
    )
    return result["secure_url"]
