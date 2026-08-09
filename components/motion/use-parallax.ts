"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The export's parallax: the layer shifts from `from`% to `to`% as its frame
 * crosses the viewport, using the progress formula
 * `(vh - top) / (vh + height)` taken straight from `BookMyNail v3.dc.html`.
 *
 * Returns a ref for the moving layer; the layer's parent is the measured frame.
 */
export function useParallax<T extends HTMLElement>(from: number, to: number) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    let raf: number | null = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const frame = el.parentElement;
        if (!frame) return;
        const r = frame.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.transform = `translateY(${(from + (to - from) * p).toFixed(2)}%)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [from, to, reduce]);

  return ref;
}
