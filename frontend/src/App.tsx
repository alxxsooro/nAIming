import { useEffect, useState } from "react";

const apiBase =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export default function App() {
  const [health, setHealth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`${apiBase}/health`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ status: string }>;
      })
      .then((data) => setHealth(data.status))
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error desconocido");
      });
    return () => ac.abort();
  }, []);

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "40rem",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Naming</h1>
      <p>Frontend mínimo conectado al API FastAPI.</p>
      <p>
        Base del API: <code>{apiBase}</code>
      </p>
      <p>
        <strong>Health</strong>:{" "}
        {error ? (
          <span style={{ color: "#b00020" }}>
            No se pudo conectar ({error}). ¿Está el backend en{" "}
            <code>uvicorn</code>?
          </span>
        ) : health ? (
          <span style={{ color: "#1b5e20" }}>{health}</span>
        ) : (
          "Comprobando…"
        )}
      </p>
    </main>
  );
}
