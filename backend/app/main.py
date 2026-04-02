from fastapi import FastAPI

app = FastAPI(
    title="Naming API",
    description="API para generación de nombres y utilidades para emprendedores.",
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness/readiness: el proceso responde y la app está montada."""
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "naming-api", "docs": "/docs"}
