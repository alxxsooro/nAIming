import { Link } from "react-router-dom";

export function BlogPage() {
  return (
    <main className="page page--article">
      <h1 className="page-title">Blog</h1>
      <p className="page-lead">
        Coming soon: guides on naming, memorability, and mistakes we see founders make every
        day.
      </p>
      <div
        className="card"
        style={{
          marginTop: "1.5rem",
          borderStyle: "dashed",
          opacity: 0.85,
        }}
      >
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Content in progress. Check back soon or head to the{" "}
          <Link to="/tool">tool</Link>.
        </p>
      </div>
    </main>
  );
}
