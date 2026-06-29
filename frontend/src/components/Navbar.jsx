import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // If we are not on the landing page, hash links won't work well.
  // In a real app, you might want to only show these on the landing page,
  // or have them navigate back to '/' then hash.
  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Testimonials", href: "/#testimonials" },
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      // Basic hash routing from landing page
      const id = href.replace("/#", "#");
      if (window.location.pathname === "/") {
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(href);
      }
    }
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? "bg-surface/50  backdrop-blur-md shadow-sm border-b border-outline-variant" : "bg-transparent"}`}
      role="banner"
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-xl h-20 max-w-container-max mx-auto">
        <Link
          to={ROUTES.HOME}
          className="text-headline-md font-headline-md font-bold text-primary no-underline"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="VirtuGym — Go to top"
        >
          <img src="./logo.png" className="h-12" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}

          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="bg-primary text-on-primary px-lg py-xs rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all no-underline"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-primary hover:text-primary-fixed-variant transition-colors text-label-md font-bold no-underline"
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-primary text-on-primary px-lg py-xs rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all no-underline"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          <span className="material-symbols-outlined text-[28px]">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden absolute top-20 left-0 w-full bg-surface/98 backdrop-blur-md border-b border-outline-variant p-md flex flex-col gap-sm shadow-md"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-on-surface-variant text-label-md py-2 border-b border-outline-variant/30"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}

          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="bg-primary text-on-primary text-center px-lg py-sm rounded-xl font-label-md mt-4"
              onClick={() => setMenuOpen(false)}
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to={ROUTES.LOGIN}
                className="border-2 border-primary text-primary text-center px-lg py-sm rounded-xl font-label-md"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-primary text-on-primary text-center px-lg py-sm rounded-xl font-label-md"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
