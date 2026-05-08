import { useEffect, useState } from "react";

const apiBase =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export function ToolPage() {
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
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => ac.abort();
  }, []);

  return (
    <main className="page page--article">
      <h1 className="page-title">Studio</h1>
      <p className="page-lead">
        Name generation will live here. For now, API status.
      </p>
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <p style={{ margin: "0 0 0.75rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          API base URL
        </p>
        <p style={{ margin: "0 0 1.25rem" }}>
          <code>{apiBase}</code>
        </p>
        <p style={{ margin: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Health</span>
          {error ? (
            <span className="status-pill status-pill--bad">
              Error: {error} — is <code>uvicorn</code> running?
            </span>
          ) : health ? (
            <span className="status-pill status-pill--ok">{health}</span>
          ) : (
            <span className="status-pill">Checking…</span>
          )}
        </p>
      </div>
    </main>
  );
}
