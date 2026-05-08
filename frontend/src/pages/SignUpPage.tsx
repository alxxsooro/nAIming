import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type PasswordStrength = "weak" | "fair" | "good" | "strong";

function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) {
    return null;
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3 || score === 4) return "good";
  return "strong";
}

function getStrengthProgress(strength: PasswordStrength | null): number {
  if (!strength) return 0;
  if (strength === "weak") return 25;
  if (strength === "fair") return 50;
  if (strength === "good") return 75;
  return 100;
}

export function SignUpPage() {
  const { signUp, configError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordStrength = getPasswordStrength(password);
  const strengthProgress = getStrengthProgress(passwordStrength);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const { error: err } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/login", {
      replace: true,
      state: { registered: true as const },
    });
  }

  return (
    <main className="page page--narrow">
      <div className="card">
        <h1 className="card__title">Create account</h1>
        {configError && (
          <div className="alert alert--error" role="alert">
            {configError}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {passwordStrength && (
              <>
                <p
                  className={`password-strength password-strength--${passwordStrength}`}
                  role="status"
                  aria-live="polite"
                >
                  {passwordStrength}
                </p>
                <div className="password-strength-bar" aria-hidden="true">
                  <span
                    className={`password-strength-bar__fill password-strength-bar__fill--${passwordStrength}`}
                    style={{ width: `${strengthProgress}%` }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="field">
            <label htmlFor="signup-confirm">Confirm password</label>
            <input
              id="signup-confirm"
              className="input"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {submitting ? "Getting started…" : "Get started"}
          </button>
        </form>
        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="link-muted">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
