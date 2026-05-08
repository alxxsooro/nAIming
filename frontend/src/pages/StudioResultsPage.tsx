import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import type { Generation, GenerationItem } from "../types/generation";

type SavedState = "idle" | "saving" | "saved" | "error";

export function StudioResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading, configError } = useAuth();

  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [savedStates, setSavedStates] = useState<Record<number, SavedState>>(
    {},
  );

  const load = useCallback(async () => {
    if (!supabase || !id) return;
    setLoadError(null);
    setNotFound(false);

    const { data, error } = await supabase
      .from("generations")
      .select("id,user_id,idea,items,created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      setLoadError(error.message);
      return;
    }
    if (!data) {
      setNotFound(true);
      return;
    }
    setGeneration(data as Generation);
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  async function saveAsProject(index: number, item: GenerationItem) {
    if (!supabase || !user || !generation) return;
    setSavedStates((s) => ({ ...s, [index]: "saving" }));

    const { data: existing, error: findError } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("metadata->>generation_id", generation.id)
      .maybeSingle();

    if (findError) {
      setSavedStates((s) => ({ ...s, [index]: "error" }));
      return;
    }

    const payload = {
      name: item.name,
      tagline: null,
      logo_url: item.logo_url,
      brief: generation.idea,
      metadata: {
        logo_type: item.logo_type,
        generation_id: generation.id,
        source: "studio",
      },
    } as const;

    const { error } = existing
      ? await supabase.from("projects").update(payload).eq("id", existing.id)
      : await supabase.from("projects").insert({ user_id: user.id, ...payload });

    if (error) {
      setSavedStates((s) => ({ ...s, [index]: "error" }));
      return;
    }
    setSavedStates((s) => ({ ...s, [index]: "saved" }));
  }

  if (configError || !supabase) {
    return (
      <main className="page page--article">
        <h1 className="page-title">Results</h1>
        <p className="page-lead">
          Connect Supabase in <code>frontend/.env</code> to view generations.
        </p>
      </main>
    );
  }

  if (authLoading || (!generation && !notFound && !loadError)) {
    return (
      <main className="page results-page">
        <header className="results-page__header">
          <div>
            <h1 className="page-title">Generating…</h1>
            <p className="page-lead" style={{ color: "var(--ink-muted)" }}>
              Loading your brand kit.
            </p>
          </div>
        </header>
        <ul className="results-grid" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="result-card result-card--skeleton">
              <div className="result-card__image-wrap" />
              <div className="result-card__skeleton-line" />
              <div className="result-card__skeleton-line result-card__skeleton-line--short" />
            </li>
          ))}
        </ul>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="page page--article">
        <h1 className="page-title">Generation not found</h1>
        <p className="page-lead">
          We couldn&apos;t find this generation. It may have been removed or
          doesn&apos;t belong to your account.
        </p>
        <Link to="/tool" className="btn btn--primary btn--sm">
          Back to Studio
        </Link>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="page page--article">
        <h1 className="page-title">Could not load results</h1>
        <p className="alert alert--error" role="alert">
          {loadError}
        </p>
        <Link to="/tool" className="btn btn--secondary btn--sm">
          Back to Studio
        </Link>
      </main>
    );
  }

  if (!generation) return null;

  return (
    <main className="page results-page">
      <header className="results-page__header">
        <div className="results-page__heading">
          <h1 className="page-title">Your brand kit</h1>
          <p className="results-page__idea">
            <span className="results-page__idea-label">Idea:</span>{" "}
            {generation.idea}
          </p>
        </div>
        <Link to="/tool" className="btn btn--secondary btn--sm">
          Generate again
        </Link>
      </header>

      <ul className="results-grid">
        {generation.items.map((item, i) => {
          const state: SavedState = savedStates[i] ?? "idle";
          return (
            <li key={`${item.name}-${i}`} className="result-card">
              <div className="result-card__image-wrap">
                <img
                  src={item.logo_url}
                  alt={`${item.name} logo`}
                  className="result-card__image"
                  loading="lazy"
                />
              </div>
              <div className="result-card__body">
                <h2 className="result-card__name">{item.name}</h2>
                <span
                  className={`result-card__type result-card__type--${item.logo_type}`}
                >
                  {item.logo_type}
                </span>
              </div>
              <button
                type="button"
                className={`btn btn--sm result-card__action${
                  state === "saved" ? " result-card__action--saved" : ""
                }`}
                onClick={() => void saveAsProject(i, item)}
                disabled={state === "saving" || state === "saved"}
              >
                {state === "saved"
                  ? "Saved"
                  : state === "saving"
                    ? "Saving…"
                    : state === "error"
                      ? "Retry save"
                      : "Save as project"}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
