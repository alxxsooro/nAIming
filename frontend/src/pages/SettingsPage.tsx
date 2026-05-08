import { useAuth } from "../contexts/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <main className="page page--article">
      <h1 className="page-title">Settings</h1>
      <p className="page-lead">
        Signed in as <strong>{user?.email ?? "—"}</strong>. Profile, billing, and team seats will
        land here.
      </p>
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--ink-muted)" }}>
          Nothing to configure yet—this page is ready for your next settings surface.
        </p>
      </div>
    </main>
  );
}
