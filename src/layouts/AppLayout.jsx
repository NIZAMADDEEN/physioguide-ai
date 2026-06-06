import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, SIDEBAR_NAV } from '../utils/constants';
import { getInitials } from '../utils/helpers';

/**
 * Authenticated Layout shell
 * Includes Sidebar, Topbar, and main content area.
 */
export default function AppLayout() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Protected route logic
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const currentRoute = SIDEBAR_NAV.find((nav) => location.pathname.startsWith(nav.path));
  const pageTitle = currentRoute ? currentRoute.label : 'Dashboard';

  return (
    <div className="d-flex vh-100 bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block" style={{ width: '260px', flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none position-fixed inset-0 z-3"
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040, backgroundColor: 'rgba(11,28,48,0.5)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="h-100 bg-surface w-75"
            style={{ maxWidth: '300px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden position-relative">
        
        {/* Top Bar */}
        <header className="bg-surface-lowest border-bottom border-outline-variant d-flex align-items-center justify-content-between px-4" style={{ height: '72px', flexShrink: 0 }}>
          <div className="d-flex align-items-center gap-3">
            <button
              className="d-lg-none btn p-1 text-primary"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>menu</span>
            </button>
            <h1 className="text-headline-md m-0">{pageTitle}</h1>
          </div>
          
          <div className="d-flex align-items-center gap-4">
            <button className="btn p-1 text-on-surface-variant position-relative" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-error border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>
            
            <div className="d-flex align-items-center gap-2">
              <div className="d-none d-md-flex flex-column align-items-end me-2">
                <span className="text-label-sm">{user?.name}</span>
                <span className="text-label-sm text-on-surface-variant fw-normal text-capitalize">{user?.role}</span>
              </div>
              <div
                className="rounded-circle bg-primary-color text-on-primary d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', fontWeight: 600 }}
              >
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-grow-1 overflow-y-auto p-3 p-md-4 p-lg-5">
          <div className="container-fluid max-w-container mx-auto p-0" style={{ maxWidth: '1440px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
