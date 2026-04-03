import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="page page--landing">
      <section className="hero hero--saas" aria-labelledby="hero-title">
        <div className="hero__inner hero__inner--center">
          <p className="hero__badge">
            <span className="hero__badge-dot" aria-hidden />
            Naming &amp; brand for indie builders
          </p>
          <h1 id="hero-title" className="hero__title hero__title--saas">
            Naming and branding for your{" "}
            <span className="hero__launch-lockup">
              <svg
                className="hero__rocket"
                viewBox="0 0 40 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M20 3l8 14h-16l8-14z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h16v14a2 2 0 01-2 2H14a2 2 0 01-2-2V17z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="24" r="2.25" stroke="currentColor" strokeWidth="1.1" />
                <path
                  d="M12 31H8l-4 10M28 31h4l4 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 33l-2 8M23 33l2 8"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.45"
                />
              </svg>
              <span className="hero__title-accent">next launch</span>
            </span>
            —in seconds.
          </h1>
          <p className="hero__lead">
            Describe what you&apos;re building. Get a shortlist that fits your positioning—and
            the confidence to share it. Domains, handles, and deeper brand signals are on the
            way.
          </p>
          <div className="hero__actions hero__actions--saas">
            <Link to="/signup" className="btn btn--primary">
              Get started <span aria-hidden>→</span>
            </Link>
            <Link to="/login" className="btn btn--secondary">
              Log in <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="hero__preview" aria-hidden>
          <div className="hero__preview-chrome">
            <span className="hero__preview-dot" />
            <span className="hero__preview-dot" />
            <span className="hero__preview-dot" />
          </div>
          <div className="hero__preview-body">
            <div className="hero__preview-sidebar" />
            <div className="hero__preview-main">
              <div className="hero__preview-bar" />
              <div className="hero__preview-rows">
                <div className="hero__preview-row" />
                <div className="hero__preview-row hero__preview-row--short" />
                <div className="hero__preview-row" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
