# Naming

Herramienta para ayudar a emprendedores con el naming de su proyecto (API en FastAPI).

## Requisitos

- Python 3.11+
- Node.js 20+ y npm

## Frontend

En la raíz del repo (tras `npm install` dentro de `frontend/` la primera vez):

```bash
cd frontend
npm install
cd ..
npm run dev
```

Abre http://127.0.0.1:5173 — comprueba el **health** del API (el backend debe estar en marcha).

Opcional: copia `frontend/.env.example` a `frontend/.env` y ajusta `VITE_API_URL` si el API no está en `http://127.0.0.1:8000`.

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
