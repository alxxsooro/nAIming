from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
