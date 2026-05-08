"""Server-side helpers to upload PNGs to a public Supabase Storage bucket."""

from __future__ import annotations

import os

import httpx


def _config() -> tuple[str, str, str]:
    base_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    bucket = os.environ.get("SUPABASE_LOGOS_BUCKET", "logos")
    if not base_url or not service_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in backend env."
        )
    return base_url, service_key, bucket


async def upload_png(client: httpx.AsyncClient, path: str, png: bytes) -> str:
    """Upload a PNG to Storage and return its public URL.

    `path` is the object key inside the bucket (e.g. ``"<gen_id>/0.png"``).
    The bucket is expected to be public (read-only) so the returned URL is
    directly usable by the browser.
    """
    base_url, service_key, bucket = _config()
    upload_url = f"{base_url}/storage/v1/object/{bucket}/{path}"

    response = await client.post(
        upload_url,
        content=png,
        headers={
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "image/png",
            "x-upsert": "true",
        },
        timeout=60.0,
    )
    if response.status_code >= 400:
        raise RuntimeError(
            f"Supabase Storage upload failed ({response.status_code}): {response.text}"
        )

    return f"{base_url}/storage/v1/object/public/{bucket}/{path}"
