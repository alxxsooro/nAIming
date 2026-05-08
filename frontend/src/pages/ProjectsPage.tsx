import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import type { Project } from "../types/project";

export function ProjectsPage() {
  const { configError } = useAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    const { data, error: err } = await supabase
      .from("projects")
      .select(
        "id,user_id,name,tagline,logo_url,brief,metadata,created_at,updated_at",
      )
      .order("updated_at", { ascending: false });

    if (err) {
      setError(err.message);
      setProjects([]);
      return;
    }
    setProjects((data ?? []) as Project[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (configError || !supabase) {
    return (
      <main className="page page--article">
        <h1 className="page-title">My projects</h1>
        <p className="page-lead">
          Connect Supabase in <code>frontend/.env</code> to load saved projects.
        </p>
      </main>
    );
  }

  if (projects === null) {
    return (
      <main className="page page--article">
        <h1 className="page-title">My projects</h1>
        <p className="page-lead" style={{ color: "var(--ink-muted)" }}>
          Loading…
        </p>
      </main>
    );
  }

  return (
    <main className="page page--article projects-page">
      <header className="projects-page__header">
        <div>
          <h1 className="page-title">My projects</h1>
          <p className="page-lead">
            Brand names, logos, and notes you save from Studio will show up here.
          </p>
        </div>
        <Link to="/tool" className="btn btn--primary btn--sm">
          Open Studio
        </Link>
      </header>

      {error && (
        <div
          className="card"
          style={{
            marginBottom: "1.25rem",
            borderColor: "rgba(220, 38, 38, 0.35)",
            background: "var(--danger-bg)",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            Could not load projects: {error}. If the table is missing, run the SQL migration in
            Supabase (see <code>supabase/migrations/001_projects.sql</code>).
          </p>
        </div>
      )}

      {projects.length === 0 && !error ? (
        <div className="card projects-page__empty">
          <p style={{ margin: "0 0 1rem", color: "var(--ink-muted)" }}>
            No saved projects yet. When you save from Studio, they will appear in this list.
          </p>
          <Link to="/tool" className="btn btn--secondary btn--sm">
            Go to Studio
          </Link>
        </div>
      ) : (
        <ul className="projects-list">
          {projects.map((p) => (
            <li key={p.id}>
              <article className="card project-card">
                <div className="project-card__main">
                  {p.logo_url ? (
                    <div className="project-card__logo-wrap">
                      <img
                        src={p.logo_url}
                        alt=""
                        className="project-card__logo"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="project-card__logo-placeholder" aria-hidden>
                      <span />
                    </div>
                  )}
                  <div className="project-card__text">
                    <h2 className="project-card__title">{p.name}</h2>
                    {p.tagline && (
                      <p className="project-card__tagline">{p.tagline}</p>
                    )}
                    {p.brief && <p className="project-card__brief">{p.brief}</p>}
                  </div>
                </div>
                <p className="project-card__meta">
                  Updated{" "}
                  {new Date(p.updated_at).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
