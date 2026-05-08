import asyncio
import uuid

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

from app.services.openai_gen import generate_brand_kit  # noqa: E402
from app.services.supabase_storage import upload_png  # noqa: E402

app = FastAPI(
    title="Naming API",
    description="API for name generation and founder utilities.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness/readiness: process responds and the app is mounted."""
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "naming-api", "docs": "/docs"}


class GenerateRequest(BaseModel):
    idea: str = Field(..., min_length=4, max_length=500)


class GenerationItemOut(BaseModel):
    name: str
    logo_type: str
    logo_url: str
    logo_prompt: str


class GenerateResponse(BaseModel):
    id: str
    idea: str
    items: list[GenerationItemOut]


@app.post("/generate", response_model=GenerateResponse)
async def generate(payload: GenerateRequest) -> GenerateResponse:
    """Produce 8 brand options (name + logo) for the given idea.

    Steps: GPT chat for the 8 names+prompts, then 8 parallel image generations,
    then upload each PNG to Supabase Storage and return permanent URLs.
    """
    idea = payload.idea.strip()

    try:
        items = await generate_brand_kit(idea)
    except Exception as exc:  # noqa: BLE001 — surface any OpenAI/parse failure as 502
        raise HTTPException(
            status_code=502, detail=f"OpenAI generation failed: {exc}"
        ) from exc

    generation_id = str(uuid.uuid4())

    async with httpx.AsyncClient() as http_client:
        results = await asyncio.gather(
            *[
                upload_png(http_client, f"{generation_id}/{i}.png", item.png_bytes)
                for i, item in enumerate(items)
            ],
            return_exceptions=True,
        )

    out_items: list[GenerationItemOut] = []
    for item, url in zip(items, results):
        if isinstance(url, BaseException):
            raise HTTPException(
                status_code=502,
                detail=f"Storage upload failed for one or more items: {url}",
            )
        out_items.append(
            GenerationItemOut(
                name=item.name,
                logo_type=item.logo_type,
                logo_url=url,
                logo_prompt=item.logo_prompt,
            )
        )

    if len(out_items) != 8:
        raise HTTPException(
            status_code=502,
            detail=f"Incomplete generation. Expected 8 items, got {len(out_items)}.",
        )

    return GenerateResponse(id=generation_id, idea=idea, items=out_items)
