import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const features = [
  {
    id: 'pose-detection',
    icon: 'accessibility_new',
    title: 'Real-Time Pose Detection',
    description:
      'Instantly identifies postural errors and provides immediate correction cues.',
  },
  {
    id: 'exercise-tracking',
    icon: 'track_changes',
    title: 'Exercise Accuracy Tracking',
    description:
      'Monitor range of motion and rep quality with sub-degree accuracy.',
  },
  {
    id: 'progress-analytics',
    icon: 'analytics',
    title: 'Progress Analytics',
    description:
      'Data-driven insights into your recovery journey with predictive healing timelines.',
  },
  {
    id: 'therapist-reports',
    icon: 'clinical_notes',
    title: 'Therapist Reports',
    description:
      'Seamlessly share recovery data with your clinic for expert review.',
  },
];

/**
 * FeaturesSection
 * 4-column card grid showcasing core product capabilities.
 */
export default function FeaturesSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-5 bg-white"
      style={{ paddingBlock: 'var(--space-xl)' }}
      aria-labelledby="features-heading"
    >
      <div className="pg-container">
        {/* Section header */}
        <div className="text-center mb-5 scroll-reveal">
          <h2
            id="features-heading"
            className="text-headline-lg text-on-surface mb-2"
          >
            Clinically Precise Features
          </h2>
          <p
            className="text-body-md text-on-surface-variant mx-auto"
            style={{ maxWidth: '560px' }}
          >
            Our technology bridges the gap between clinic visits and home recovery.
          </p>
        </div>

        {/* Cards grid */}
        <div className="row g-4">
          {features.map((feature) => (
            <div key={feature.id} className="col-12 col-md-6 col-lg-3 scroll-reveal">
              <article
                className="feature-card"
                aria-labelledby={`feature-${feature.id}-title`}
              >
                <div
                  className="feature-icon-wrap"
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </div>
                <h3
                  id={`feature-${feature.id}-title`}
                  className="text-headline-md text-on-surface mb-2"
                >
                  {feature.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mb-0">
                  {feature.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
