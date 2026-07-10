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


def upload_image_bytes(data: bytes, folder: str, is_gif: bool = False) -> str:
    """Uploads raw image bytes to Cloudinary and returns the secure HTTPS URL."""
    _ensure_configured()
    kwargs = {"folder": folder, "resource_type": "image"}
    if not is_gif:
        # Cap dimensions server-side so a huge upload doesn't balloon storage —
        # Cloudinary resizes on upload, not just via URL transforms. Skipped
        # for GIFs specifically: an upload-time transformation flattens an
        # animated GIF down to its first frame only, so this was silently
        # turning every uploaded GIF into a static image. GIFs already go
        # through the same 5MB cap (routers/uploads.py) so there's no
        # unbounded-storage risk from leaving them unresized.
        kwargs["transformation"] = [{"width": 1600, "height": 1600, "crop": "limit"}]
    result = cloudinary.uploader.upload(data, **kwargs)
    return result["secure_url"]
