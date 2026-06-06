import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const testimonials = [
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    role: 'ACL Recovery Patient',
    roleColor: 'var(--color-secondary)',
    quoteIconColor: 'var(--color-secondary)',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrBQYrHecP0JUvOu8Obz5W4HZ33QANFHgw11vzDvE5d6qIOTEfkJuQjjv9hxvEx_SvdfUqC9l1ZAsRAKOuuO0q8uh7USv7qrb0IJc40plQYIaf_0wKDkAOLEQCCQ67UimEP2UtCmgc6gkgpWsVC1Fl4VeYXHZL8KRktBmReyNC9vwFkj0UAKJaop6Xd99tgkT7vR_b5f7Cg0h56UF3qE5T09wGwPzhPcSUq_ro3TrunOL1csIau9lm2DV9Xikzf5sca0chLs6URdlZ',
    avatarAlt: 'Sarah Johnson — ACL Recovery Patient, smiling in athletic wear outdoors',
    quote:
      '"I was hesitant about home rehab, but PhysioGuide AI changed everything. I was back to running in half the time my surgeon expected!"',
  },
  {
    id: 'dr-marcus-chen',
    name: 'Dr. Marcus Chen',
    role: 'DPT, Sports Specialist',
    roleColor: 'var(--color-primary)',
    quoteIconColor: 'var(--color-primary)',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKxrHS9LGg9sTmhDEoWOjEYriiqn6GnegsOS5XffUKiP4kYWGYth8RmOS4UEf9_AdKWv8hLjbFz8M3nFC_151eLPchtDrYxawGEFpFRBE8YB2_CU4TfQRX-2eQCv7_CnNFc_K-VajeCDrsf_gj7YVdCqGpiJ2Rln2DzTM0rN_PJX87Z9rh5Z5BDDaeClyNu7IZgs9FfeRAYut6VRQS-1GIU8fz3DPpn_g6a35HDMxfxX8lglwPumF0gIyeAUnPpsk54OaB735Du8FH',
    avatarAlt: 'Dr. Marcus Chen — DPT Sports Specialist, wearing white lab coat in a modern clinic',
    quote:
      '"The data precision helps me adjust treatments faster. Seeing exactly how my patients move between sessions is a complete game-changer."',
  },
];

/**
 * TestimonialsSection
 * Two-column grid of patient and professional quote cards.
 */
export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-5 bg-white"
      style={{ paddingBlock: 'var(--space-xl)' }}
      aria-labelledby="testimonials-heading"
    >
      <div className="pg-container">
        <h2
          id="testimonials-heading"
          className="text-headline-lg text-on-surface text-center mb-5 scroll-reveal"
        >
          Trusted by Patients and Pros
        </h2>

        <div className="row g-4">
          {testimonials.map((t) => (
            <div key={t.id} className="col-12 col-md-6 scroll-reveal">
              <figure
                className="testimonial-card h-100 m-0"
                aria-label={`Testimonial from ${t.name}`}
              >
                {/* Decorative quote icon */}
                <span
                  className="material-symbols-outlined testimonial-quote-icon"
                  aria-hidden="true"
                  style={{ color: t.quoteIconColor }}
                >
                  format_quote
                </span>

                {/* Author */}
                <figcaption className="d-flex align-items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.avatarAlt}
                    className="testimonial-avatar"
                    loading="lazy"
                  />
                  <div>
                    <div
                      className="text-on-surface"
                      style={{ fontWeight: 700, fontSize: 'var(--text-body-md-size)' }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="testimonial-role-chip"
                      style={{ color: t.roleColor }}
                    >
                      {t.role}
                    </div>
                  </div>
                </figcaption>

                {/* Quote */}
                <blockquote className="testimonial-quote">
                  {t.quote}
                </blockquote>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
