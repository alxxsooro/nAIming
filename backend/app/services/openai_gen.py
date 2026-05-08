"""OpenAI brand-kit generation: 8 (name + logo) combinations across logo types."""

from __future__ import annotations

import asyncio
import base64
import json
import os
from dataclasses import dataclass
from typing import Literal

from openai import AsyncOpenAI

LogoType = Literal["logotipo", "isotipo", "imagotipo", "isologo"]
ALLOWED_TYPES: tuple[LogoType, ...] = (
    "logotipo",
    "isotipo",
    "imagotipo",
    "isologo",
)

ITEMS_PER_GENERATION = 8
IMAGE_CONCURRENCY = 6
IMAGE_RETRIES = 2
IMAGE_MODEL = "gpt-image-1"
IMAGE_SIZE = "1024x1024"
IMAGE_QUALITY = "medium"
CHAT_MODEL = "gpt-4o-mini"
CHAT_TEMPERATURE = 0.9


@dataclass
class GeneratedItem:
    name: str
    logo_type: LogoType
    logo_prompt: str
    png_bytes: bytes


_SYSTEM_PROMPT = """You are a brand naming and logo brief expert.
Given a one or two sentence business idea from the user, produce exactly 8 brand options.

Each option must have:
- name: a short, distinctive, brandable name (1-2 words, easy to say, original, no generic words like "Hub" or "Lab" unless they truly fit)
- logo_type: one of "logotipo", "isotipo", "imagotipo", "isologo". Distribute evenly across the 8 items (2 of each).
- logo_prompt: a tight English image-generation prompt for that logo, tailored to the type and the idea. Always specify: vector style, plain white background, modern, clean, balanced. Do not include photographs.

Constraints per logo_type:
- logotipo: a wordmark only (the brand name as styled typography). No icon, no symbol.
- isotipo: an icon-only symbol. No text, no letters whatsoever.
- imagotipo: a small icon to the left of the wordmark (icon and text are visually separate but balanced).
- isologo: an integrated mark where icon and brand name are fused into a single shape.

Return strict JSON with this exact shape and nothing else:
{"items": [{"name": "...", "logo_type": "...", "logo_prompt": "..."}, ...]}
No prose, no markdown, just JSON.
"""


async def _chat_brand_options(client: AsyncOpenAI, idea: str) -> list[dict]:
    response = await client.chat.completions.create(
        model=CHAT_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": f"Business idea: {idea}"},
        ],
        temperature=CHAT_TEMPERATURE,
    )
    raw = response.choices[0].message.content or "{}"
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"OpenAI returned invalid JSON: {e}") from e

    raw_items = data.get("items") if isinstance(data, dict) else None
    if not isinstance(raw_items, list) or len(raw_items) < ITEMS_PER_GENERATION:
        raise ValueError(
            f"OpenAI returned {len(raw_items) if isinstance(raw_items, list) else 0} items, "
            f"expected at least {ITEMS_PER_GENERATION}."
        )

    normalized: list[dict] = []
    for it in raw_items[:ITEMS_PER_GENERATION]:
        if not isinstance(it, dict):
            continue
        logo_type = str(it.get("logo_type", "")).strip().lower()
        if logo_type not in ALLOWED_TYPES:
            logo_type = "isologo"
        normalized.append(
            {
                "name": str(it.get("name", "")).strip() or "Untitled",
                "logo_type": logo_type,
                "logo_prompt": str(it.get("logo_prompt", "")).strip(),
            }
        )
    if len(normalized) < ITEMS_PER_GENERATION:
        raise ValueError("Could not normalize 8 valid items from OpenAI response.")
    return normalized


async def _generate_image(
    client: AsyncOpenAI, prompt: str, sem: asyncio.Semaphore
) -> bytes:
    async with sem:
        last_error: Exception | None = None
        for _ in range(IMAGE_RETRIES + 1):
            try:
                result = await client.images.generate(
                    model=IMAGE_MODEL,
                    prompt=prompt,
                    size=IMAGE_SIZE,
                    quality=IMAGE_QUALITY,
                    n=1,
                )
                b64 = result.data[0].b64_json if result.data else None
                if not b64:
                    raise ValueError("OpenAI image response missing b64_json.")
                return base64.b64decode(b64)
            except Exception as exc:  # noqa: BLE001 - retry transient provider errors
                last_error = exc
        raise RuntimeError(f"Image generation failed after retries: {last_error}")


async def generate_brand_kit(idea: str) -> list[GeneratedItem]:
    """Generate 8 (name + logo) combinations for a business idea.

    This endpoint is strict: it either returns all 8 assets or raises.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    client = AsyncOpenAI(api_key=api_key)
    options = await _chat_brand_options(client, idea)

    sem = asyncio.Semaphore(IMAGE_CONCURRENCY)
    pngs = await asyncio.gather(
        *[_generate_image(client, opt["logo_prompt"], sem) for opt in options],
        return_exceptions=True,
    )

    items: list[GeneratedItem] = []
    for opt, png in zip(options, pngs):
        if isinstance(png, BaseException):
            continue
        items.append(
            GeneratedItem(
                name=opt["name"],
                logo_type=opt["logo_type"],  # already validated above
                logo_prompt=opt["logo_prompt"],
                png_bytes=png,
            )
        )

    if len(items) != ITEMS_PER_GENERATION:
        raise RuntimeError(
            f"Expected {ITEMS_PER_GENERATION} images, generated {len(items)}."
        )
    return items
