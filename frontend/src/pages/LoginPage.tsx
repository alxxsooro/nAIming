import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { signIn, configError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: { pathname: string }; registered?: boolean } | null;
  const from = state?.from?.pathname ?? "/tool";
  const justRegistered = state?.registered === true;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <main className="page page--narrow">
      <div className="card">
        <h1 className="card__title">Log in</h1>
        {justRegistered && (
          <div className="alert alert--success" role="status">
            Account created. If email confirmation is required, check your inbox before logging
            in.
          </div>
        )}
        {configError && (
          <div className="alert alert--error" role="alert">
            {configError}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: "100%", marginTop: "0.25rem" }}
            disabled={submitting || Boolean(configError)}
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="form-footer">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="link-muted">
            Get started
          </Link>
        </p>
      </div>
    </main>
  );
}
