import { NavLink, Link } from 'react-router-dom';
import { SIDEBAR_NAV, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

/**
 * Sidebar navigation component for authenticated AppLayout.
 */
export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="pg-sidebar d-flex flex-column h-100 bg-surface-lowest border-end border-outline-variant">
      {/* Brand */}
      <div className="p-4 border-bottom border-outline-variant">
        <Link to={ROUTES.DASHBOARD} className="text-decoration-none">
          <span className="text-headline-md font-bold text-primary">PhysioGuide AI</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-grow-1 p-3 overflow-y-auto">
        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
          {SIDEBAR_NAV.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                    isActive
                      ? 'bg-primary-color bg-opacity-10 text-primary font-bold'
                      : 'text-on-surface-variant hover-bg-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-label-md">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-top border-outline-variant">
        <button
          onClick={logout}
          className="btn w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-on-surface-variant hover-bg-surface text-start border-0"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
