import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import './Layout.css';

export default function Layout() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-text">Raul Barbosa Neto</span>
          </Link>

          <ul className="nav-items">
            <li>
              <Link to="/">Portfolio</Link>
            </li>

            {isAuthenticated && (
              <>
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
                <li>
                  <button onClick={logout} className="btn-logout">
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <li>
                <Link to="/admin/login" className="btn-login">
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Raul Barbosa Neto. All rights reserved.</p>
      </footer>
    </>
  );
}
