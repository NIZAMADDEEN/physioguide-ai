import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Hero image — using the original Stitch source URL
const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAduGkzaiET5TGJxDJGaMhO2CujxyHyalhPs9cYTMvwtqqqUBT4CS8YeWoLKtupiMK_RhtiK3_QQ-S7U6zMqQn7zWkeyAXzn5ykJp7YewvxU5byiEaSyVuqze5U8PbhuK0fX5VDI1rKpsa5vjqnCzJEewu5xyI9x_5SS7DuCLCvO5Rqh1HibgHtYyOu1hPXWAdtg4z3E2zIHMRsnHOOp89TcY2TeSWCz-sxftH4JLGBSQAavGCvwThm3tp76F-2lUud5xZSawlx2PB0';

/**
 * HeroSection
 * Two-column layout: text (left) + AI demo image (right).
 * Collapses to single column on mobile.
 */
export default function HeroSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="hero-section hero-gradient"
      aria-labelledby="hero-heading"
    >
      <div className="pg-container">
        <div className="row align-items-center g-5">
          {/* --- Text column --- */}
          <div className="col-12 col-md-6 text-center text-md-start scroll-reveal">
            {/* Badge */}
            <div className="hero-badge d-inline-flex mb-3">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                verified_user
              </span>
              <span>Medical Grade AI Accuracy</span>
            </div>

            {/* Heading */}
            <h1
              id="hero-heading"
              className="text-display-lg text-on-surface mb-4"
              style={{ maxWidth: '560px', marginInline: 'auto' }}
            >
              Recover Smarter with{' '}
              <span className="text-primary">AI Physiotherapy</span> Guidance
            </h1>

            {/* Sub-copy */}
            <p
              className="text-body-lg text-on-surface-variant mb-4"
              style={{ maxWidth: '480px', marginInline: 'auto' }}
            >
              Professional rehabilitation from the comfort of home. Our AI monitors your form
              in real-time using computer vision to ensure every rep counts.
            </p>

            {/* CTAs */}
            <div
              className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start"
              style={{ paddingTop: 'var(--space-sm)' }}
            >
              <button
                className="btn-pg-primary"
                id="hero-cta-primary"
                aria-label="Start your recovery journey"
                onClick={() =>
                  document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Start Recovery
              </button>

              <button
                className="btn-pg-secondary"
                id="hero-cta-demo"
                aria-label="Watch a product demo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  play_circle
                </span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* --- Image column --- */}
          <div className="col-12 col-md-6 scroll-reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="hero-image-card">
              <img
                src={HERO_IMAGE}
                alt="A woman performing a physiotherapy squat in a bright living room with a teal AI skeletal wireframe overlay tracking her joint angles in real time"
                loading="eager"
                fetchpriority="high"
              />

              {/* AI Active badge */}
              <div className="hero-overlay-badge">
                <div
                  className="glass-card d-flex align-items-center gap-2"
                  style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)' }}
                  aria-label="AI is actively analyzing pose"
                >
                  <div className="ai-pulse-dot" aria-hidden="true" />
                  <span className="text-label-sm" style={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
                    AI ACTIVE
                  </span>
                </div>
              </div>

              {/* Knee angle metric */}
              <div className="hero-overlay-metric">
                <div
                  className="glass-card"
                  style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
                  aria-label="Knee angle measurement: 92 degrees"
                >
                  <div
                    className="text-label-sm"
                    style={{ color: 'var(--color-secondary)', fontWeight: 700 }}
                  >
                    Knee Angle: 92°
                  </div>
                  <div className="metric-bar" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                    <div className="metric-bar-fill" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
