import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AppLayout() {
  const { user, loading, signOut, configError } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="shell">
      <header className="site-header">
        <div className="site-header__card">
          <Link to="/" className="site-logo">
            <span className="site-logo__mark" aria-hidden />
            Naming
          </Link>
          <nav className="site-nav" aria-label="Main">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/tool"
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
            >
              Tool
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
            >
              Blog
            </NavLink>
          </nav>
          <div className="site-header__actions">
            {configError && (
              <span className="badge-warn" title={configError}>
                Config
              </span>
            )}
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="user-email" title={user.email ?? undefined}>
                      {user.email}
                    </span>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={async () => {
                        await signOut();
                        navigate("/");
                      }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link">
                      Log in
                    </Link>
                    <Link to="/signup" className="btn btn--primary btn--sm">
                      Get started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>
      <main className="shell__main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer__card">
          <div className="site-footer__grid">
            <div className="site-footer__brand">
              <Link to="/" className="site-logo">
                <span className="site-logo__mark" aria-hidden />
                Naming
              </Link>
              <p className="site-footer__tagline">
                Naming and branding for your next launch—in seconds.
              </p>
            </div>
            <nav className="site-footer__nav" aria-label="Footer">
              <div className="site-footer__group">
                <h2 className="site-footer__label">Product</h2>
                <Link to="/tool" className="nav-link">
                  Tool
                </Link>
                <Link to="/blog" className="nav-link">
                  Blog
                </Link>
              </div>
              <div className="site-footer__group">
                <h2 className="site-footer__label">Resources</h2>
                <Link to="/#how-it-works" className="nav-link">
                  How it works
                </Link>
                <Link to="/#faq" className="nav-link">
                  FAQ
                </Link>
              </div>
            </nav>
          </div>
          <div className="site-footer__rule" aria-hidden />
          <p className="site-footer__copy">
            © {new Date().getFullYear()} Naming. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
