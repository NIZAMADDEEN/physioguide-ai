import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

/**
 * Public Layout for Landing, Login, Register
 * Includes Navbar and optionally Footer.
 */
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If authenticated, prevent access to login/register and redirect to dashboard
  if (isAuthenticated && (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Hide footer on login/register pages for a cleaner focus
  const hideFooter = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  return (
    <div className="d-flex flex-column min-vh-100 bg-background">
      <Navbar />
      <main className="flex-grow-1 d-flex flex-column" style={{ marginTop: '80px' }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
