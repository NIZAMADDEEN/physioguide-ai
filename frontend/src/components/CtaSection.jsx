import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * CtaSection
 * Full-width primary blue banner with headline, subtitle, and two CTAs.
 */
export default function CtaSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="cta-section"
      aria-labelledby="cta-heading"
    >
      <div className="pg-container">
        <div className="cta-card scroll-reveal">
          <h2
            id="cta-heading"
            className="text-display-lg mb-3"
            style={{ color: 'var(--color-on-primary)' }}
          >
            Ready to start your recovery?
          </h2>

          <p
            className="text-body-lg mb-4 mx-auto"
            style={{
              color: 'var(--color-on-primary)',
              opacity: 0.9,
              maxWidth: '560px',
            }}
          >
            Join thousands of patients using AI to heal faster and smarter.
            No commitment required.
          </p>

          <div
            className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
            style={{ paddingTop: 'var(--space-sm)' }}
          >
            <button
              className="btn-pg-white"
              id="cta-get-started"
              aria-label="Get started for free"
              style={{ justifyContent: 'center' }}
            >
              Get Started Free
            </button>
            <button
              className="btn-pg-outline-white"
              id="cta-contact-sales"
              aria-label="Contact our sales team"
              style={{ justifyContent: 'center' }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
