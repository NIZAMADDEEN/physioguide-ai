import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar Component (Public facing)
 * Fixed top navigation with logo, smooth-scroll anchor links, and mobile hamburger menu.
 * Uses auth context to show Login vs Dashboard button.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Add subtle background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // If we are not on the landing page, hash links won't work well.
  // In a real app, you might want to only show these on the landing page,
  // or have them navigate back to '/' then hash.
  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Testimonials', href: '/#testimonials' },
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      // Basic hash routing from landing page
      const id = href.replace('/#', '#');
      if (window.location.pathname === '/') {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(href);
      }
    }
  };

  return (
    <header
      ref={navRef}
      className={`pg-navbar fixed-top d-flex align-items-center${scrolled ? ' scrolled' : ''}`}
      role="banner"
    >
      <div className="pg-container w-100">
        <nav
          className="d-flex align-items-center justify-content-between"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <Link
            to={ROUTES.HOME}
            className="navbar-brand text-decoration-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="PhysioGuide AI — Go to top"
          >
            PhysioGuide AI
          </Link>

          {/* Desktop nav */}
          <div className="d-none d-md-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-label-md"
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            ))}
            
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD} className="btn-pg-primary btn-pg-primary-pill text-label-md ms-2 text-decoration-none">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="nav-link text-label-md font-bold">
                  Log in
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-pg-primary btn-pg-primary-pill text-label-md ms-2 text-decoration-none">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="pg-navbar-toggler d-flex d-md-none align-items-center justify-content-center"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              padding: '4px',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </nav>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <div
            id="mobile-nav"
            className="d-md-none"
            style={{
              background: 'rgba(248,249,255,0.98)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid var(--color-outline-variant)',
              padding: 'var(--space-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-label-md"
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            ))}
            
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD} className="btn-pg-primary text-label-md mt-2 text-center text-decoration-none" onClick={() => setMenuOpen(false)}>
                Go to Dashboard
              </Link>
            ) : (
              <div className="d-flex flex-column gap-2 mt-2">
                <Link to={ROUTES.LOGIN} className="btn-pg-secondary text-label-md text-center text-decoration-none" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-pg-primary text-label-md text-center text-decoration-none" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
