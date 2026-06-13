/**
 * Footer Component
 * 4-column grid: Brand + copyright, Product links, Company links, Contact + social.
 */

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Resources', href: '#' },
];

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

export default function Footer() {
  const handleClick = (e, href) => {
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="pg-footer" role="contentinfo" aria-label="Site footer">
      <div className="pg-container">
        <div className="row g-4">
          {/* Brand column */}
          <div className="col-12 col-sm-6 col-md-3">
            <span className="footer-brand">PhysioGuide AI</span>
            <p
              className="text-label-sm text-on-surface-variant mb-3"
              style={{ maxWidth: '220px' }}
            >
              © 2024 PhysioGuide AI. Precision recovery powered by computer vision.
            </p>
          </div>

          {/* Product links */}
          <div className="col-6 col-md-3">
            <span className="footer-heading">Product</span>
            <nav aria-label="Product links">
              {productLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link mb-2"
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company links */}
          <div className="col-6 col-md-3">
            <span className="footer-heading">Company</span>
            <nav aria-label="Company links">
              {companyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link mb-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact column */}
          <div className="col-12 col-sm-6 col-md-3">
            <span className="footer-heading">Contact</span>
            <a
              href="mailto:support@physioguide.ai"
              className="footer-link text-label-sm mb-3"
              aria-label="Email us at support@physioguide.ai"
            >
              support@physioguide.ai
            </a>

            {/* Social buttons */}
            <div className="d-flex gap-2 mt-2" role="list" aria-label="Social media links">
              <button
                className="social-btn"
                aria-label="Share on social media"
                role="listitem"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  share
                </span>
              </button>
              <button
                className="social-btn"
                aria-label="Contact via email"
                role="listitem"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  alternate_email
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
