import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, UserCircle2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Navbar(): JSX.Element {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isLoggedIn = Boolean(token && user);
  const initials = useMemo(() => (user ? getInitials(user.name) : "G"), [user]);

  const closeDrawer = (): void => {
    setDrawerOpen(false);
  };

  const handleLogout = (): void => {
    logout();
    closeDrawer();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to={isLoggedIn ? "/dashboard" : "/login"} className="brand-link" aria-label="TaskFlow home">
          <span className="brand-icon" aria-hidden="true" />
          <strong>TaskFlow</strong>
        </Link>
      </div>

      <button
        type="button"
        className="hamburger-btn"
        onClick={() => setDrawerOpen((current) => !current)}
        aria-label="Toggle navigation menu"
        aria-expanded={drawerOpen}
      >
        {drawerOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="navbar-right desktop-only">
        {isLoggedIn && user ? (
          <>
            <div className="user-chip" role="status" aria-label={`Logged in as ${user.name}`}>
              <span className="avatar-circle">{initials}</span>
              <div className="user-meta">
                <span className="user-name">{user.name}</span>
                <span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
            </div>
            <ThemeToggle />
            <button type="button" className="btn btn-ghost danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <ThemeToggle />
            <Link to="/login" className={`btn btn-ghost ${location.pathname === "/login" ? "active" : ""}`}>
              Login
            </Link>
            <Link to="/register" className={`btn btn-accent ${location.pathname === "/register" ? "active" : ""}`}>
              Register
            </Link>
          </>
        )}
      </div>

      <aside className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <h2>Menu</h2>
          <button type="button" onClick={closeDrawer} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {isLoggedIn && user ? (
          <div className="drawer-user">
            <span className="avatar-circle">{initials}</span>
            <div>
              <p>{user.name}</p>
              <span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span>
            </div>
          </div>
        ) : (
          <div className="drawer-user">
            <UserCircle2 size={26} />
            <p>Guest</p>
          </div>
        )}

        <div className="drawer-actions">
          <ThemeToggle className="drawer-theme" />
          {!isLoggedIn ? (
            <>
              <Link className="btn btn-ghost" to="/login" onClick={closeDrawer}>
                Login
              </Link>
              <Link className="btn btn-accent" to="/register" onClick={closeDrawer}>
                Register
              </Link>
            </>
          ) : (
            <button type="button" className="btn btn-ghost danger" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </aside>
    </header>
  );
}
