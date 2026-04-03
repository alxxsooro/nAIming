import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, configError } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="loading-screen">Loading session…</main>;
  }

  if (configError) {
    return (
      <main className="page page--article">
        <div className="card">
          <h1 className="card__title">Configure Supabase</h1>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            Copy <code>frontend/.env.example</code> to <code>frontend/.env</code> and set{" "}
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> from your
            Supabase dashboard (Settings → API).
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
