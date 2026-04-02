# Naming

Herramienta para ayudar a emprendedores con el naming de su proyecto (API en FastAPI).

## Requisitos

- Python 3.11+

## API (backend)

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Documentación interactiva: http://127.0.0.1:8000/docs
- Health check: `GET http://127.0.0.1:8000/health`

## Licencia

Por definir.
