import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Progress dashboard image from Stitch source
const HOW_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvDQeltTTS3N9p1TPJWTnCAIEg7zC0H75LRgAAIvqrMztDeKsXscHrpZ1wSKYzJY2TeHbCmF_Xq5JGyTmKybo2tJpwDVFdzkeYamLY8qd8R_FYwd3jqsWtY0AMpxlHjfXiCRHbOscljt5Y7dILqqPOg2C7GR2FxYTMqi8QD_XYBMkx8psIVOPQrevWOrS4DIszLPrmeA--D9vdEfMazyLkPgEYXmpNFdyUG1iuV9jFCd1LE75dMD1SMNjuhGfr0mUX-IpeQFcq9nwZ';

const steps = [
  {
    number: 1,
    title: 'Select Exercise',
    description:
      'Choose from a library of personalized routines tailored to your specific injury and fitness level.',
  },
  {
    number: 2,
    title: 'Start Camera',
    description:
      'No extra hardware needed, just your laptop or phone. Our AI works directly through your browser.',
  },
  {
    number: 3,
    title: 'Receive Feedback',
    description:
      'Get audio and visual cues for correct form, just like having a therapist standing beside you.',
  },
  {
    number: 4,
    title: 'Track Progress',
    description:
      'Watch your mobility improve with every session through interactive charts and strength metrics.',
  },
];

/**
 * HowItWorksSection
 * Left: numbered steps list. Right: product screenshot panel.
 */
export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="how-section"
      aria-labelledby="how-heading"
    >
      <div className="pg-container">
        <div className="row align-items-center g-5">
          {/* --- Steps column --- */}
          <div className="col-12 col-lg-6 scroll-reveal">
            <h2
              id="how-heading"
              className="text-headline-lg text-on-surface mb-4"
            >
              Simple Path to Recovery
            </h2>

            <ol
              className="list-unstyled d-flex flex-column"
              style={{ gap: 'var(--space-lg)' }}
              aria-label="Recovery steps"
            >
              {steps.map((step) => (
                <li key={step.number} className="d-flex align-items-start gap-3">
                  <div
                    className="step-number"
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-headline-md text-on-surface mb-1">
                      {step.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mb-0">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* --- Image column --- */}
          <div className="col-12 col-lg-6 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="how-image-panel">
              <img
                src={HOW_IMAGE}
                alt="A tablet displaying a teal and blue health dashboard with recovery progress rings and line graphs in a bright home office"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
