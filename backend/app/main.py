from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Naming API",
    description="API para generación de nombres y utilidades para emprendedores.",
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
    """Liveness/readiness: el proceso responde y la app está montada."""
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "naming-api", "docs": "/docs"}
