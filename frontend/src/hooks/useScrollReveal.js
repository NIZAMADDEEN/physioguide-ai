import { useEffect } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to all elements matching `selector`
 * inside the given `containerRef`. Adds `.revealed` when they enter viewport.
 *
 * @param {React.RefObject} containerRef - ref to the section/container element
 * @param {string} selector - CSS selector for children to animate (default: '.scroll-reveal')
 * @param {number} threshold - visibility threshold 0–1 (default: 0.1)
 */
export function useScrollReveal(containerRef, selector = '.scroll-reveal', threshold = 0.1, dependencies = []) {
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const elements = Array.from(container.querySelectorAll(selector));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [containerRef, selector, threshold, ...dependencies]);
}
