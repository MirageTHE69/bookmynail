"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Counts 0 → `to` on first view over 1.5s.
 *
 * The initial render shows the true value, exactly as the export does — a
 * missed animation then leaves the right number on screen rather than a zero.
 */
export default function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setValue(Math.round(v)),
      onComplete: () => setValue(to),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{value.toLocaleString("en-IN")}</span>;
}
