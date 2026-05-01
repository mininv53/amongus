import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useStepReveal — sequentially "lights up" child elements as the section
 * scrolls into view. Used by "How it works" so step 01 → 02 → 03 visibly
 * activate in order, reinforcing the linear flow of the product.
 *
 * Each child must carry `data-step="…"` (we don't depend on the value,
 * just on count + order).
 */
export function useStepReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll('[data-step]'));
    if (!items.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      items.forEach((el) => el.classList.add('is-active'));
      return undefined;
    }

    items.forEach((el) => {
      el.style.opacity = '0.35';
      el.style.transform = 'translateY(8px)';
    });

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      })
        .to(items, {
          opacity: 1,
          y: 0,
          stagger: 0.4,
          duration: 0.6,
          ease: 'power2.out',
          onStart: () => items.forEach((el) => el.classList.add('is-active')),
        });
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * useScrollProgress — drives a single CSS variable (`--progress`, 0..1) on the
 * referenced element, tied to its scroll position within the viewport. Used by
 * the demo "scan-fill" visual so the fill bar grows as the user reads.
 */
export function useScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.style.setProperty('--progress', '1');
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        el.style.setProperty('--progress', self.progress.toFixed(3));
      },
    });

    return () => trigger.kill();
  }, []);

  return ref;
}
