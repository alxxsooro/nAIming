import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import type { Project } from "../types/project";
import type { GenerateResponse } from "../types/generation";

type ChatStatus = "idle" | "working";

const PROJECTS_PREVIEW_LIMIT = 5;
const apiBase =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export function ToolPage() {
  const { configError, user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!supabase) return;
    setProjectsError(null);
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,user_id,name,tagline,logo_url,brief,metadata,created_at,updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(PROJECTS_PREVIEW_LIMIT);

    if (error) {
      setProjectsError(error.message);
      setProjects([]);
      return;
    }
    setProjects((data ?? []) as Project[]);
  }, []);

  useEffect(() => {
    if (configError || !supabase) return;
    void loadProjects();
  }, [configError, loadProjects]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 7.5 * 16; // ~5 rows
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [idea]);

  const trimmed = idea.trim();
  const canSubmit = trimmed.length >= 4 && status === "idle";

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;
    setSubmitError(null);
    setStatus("working");

    try {
      const res = await fetch(`${apiBase}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: trimmed }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Generation failed (${res.status}). ${text || "Try again in a moment."}`,
        );
      }
      const data = (await res.json()) as GenerateResponse;

      if (supabase && user) {
        const { error: insertError } = await supabase
          .from("generations")
          .insert({
            id: data.id,
            user_id: user.id,
            idea: data.idea,
            items: data.items,
          });
        if (insertError) {
          throw new Error(`Could not save generation: ${insertError.message}`);
        }
      }

      navigate(`/studio/results/${data.id}`, { replace: true });
    } catch (err) {
      setStatus("idle");
      setSubmitError(
        err instanceof Error ? err.message : "Unexpected error. Try again.",
      );
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <main className="page page--article studio-page">
      <section className="studio-hero">
        <h1 className="studio-hero__title">
          From idea to <span className="studio-hero__brand">brand</span>{" "}
          <span className="studio-hero__nowrap">in seconds.</span>
        </h1>
        <p className="studio-hero__lead">
          Tell us what you&apos;re building and we&apos;ll craft tailored names,
          logos, taglines, color systems, and branding foundations for your new
          business
        </p>

        <form
          className={`studio-chat${status === "working" ? " studio-chat--busy" : ""}`}
          onSubmit={handleSubmit}
        >
          <label htmlFor="studio-idea" className="visually-hidden">
            Describe your business idea
          </label>
          <textarea
            id="studio-idea"
            ref={textareaRef}
            className="studio-chat__textarea"
            placeholder="Describe your business idea in 1-2 sentences..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={status === "working"}
          />
          <div className="studio-chat__bar">
            <button
              type="button"
              className="studio-chat__plus"
              aria-label="Add context (coming soon)"
              disabled
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
            <button
              type="submit"
              className="studio-chat__submit"
              disabled={!canSubmit}
              aria-label="Generate"
            >
              {status === "working" ? (
                <span
                  className="studio-chat__spinner"
                  aria-hidden="true"
                />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
        </form>

        <p
          className={`studio-chat__status${
            status === "working" ? " studio-chat__status--visible" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          Generating your brand kit… this may take 30-60 seconds.
        </p>

        {submitError && (
          <div
            className="alert alert--error"
            role="alert"
            style={{ width: "100%", maxWidth: "38rem", margin: "0 auto" }}
          >
            {submitError}
          </div>
        )}
      </section>

      {!configError && supabase && (
        <section className="studio-section">
          <header className="studio-section__header">
            <h2 className="studio-section__title">Your projects</h2>
            <Link to="/projects" className="link-muted">
              View all
            </Link>
          </header>

          {projectsError && (
            <div className="alert alert--error" role="alert">
              Could not load projects: {projectsError}
            </div>
          )}

          {projects === null && !projectsError ? (
            <p className="studio-section__muted">Loading…</p>
          ) : projects && projects.length === 0 && !projectsError ? (
            <div className="card projects-page__empty">
              <p style={{ margin: 0, color: "var(--ink-muted)" }}>
                No projects yet. Describe your idea above to get started.
              </p>
            </div>
          ) : (
            projects && (
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
                          <div
                            className="project-card__logo-placeholder"
                            aria-hidden
                          >
                            <span />
                          </div>
                        )}
                        <div className="project-card__text">
                          <h3 className="project-card__title">{p.name}</h3>
                          {p.tagline && (
                            <p className="project-card__tagline">{p.tagline}</p>
                          )}
                          {p.brief && (
                            <p className="project-card__brief">{p.brief}</p>
                          )}
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
            )
          )}
        </section>
      )}
    </main>
  );
}
