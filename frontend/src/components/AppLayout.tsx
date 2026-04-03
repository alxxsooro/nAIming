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
      <Outlet />
    </div>
  );
}
