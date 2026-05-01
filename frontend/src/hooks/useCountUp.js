import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useCountUp — animates a number from 0 to `value` when the element scrolls
 * into view. Used for the trust-strip numbers ("3 AI Models", "30s scan", etc.)
 * so the counters feel earned, not just printed.
 */
export default function useCountUp(value, { decimals = 0, duration = 1.4 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = Number(value).toFixed(decimals);
      return undefined;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals);
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, decimals, duration]);

  return ref;
}
