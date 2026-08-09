"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REVIEWS, REVIEW_INTERVAL_MS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Reviews() {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  const reduce = useReducedMotion();

  // Auto-advance every 5.6s; picking a dot restarts the timer, as in the export.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % REVIEWS.length), REVIEW_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce, tick]);

  const show = useCallback((n: number) => {
    setI(n);
    setTick((t) => t + 1);
  }, []);

  const tint = REVIEWS[i].tint;

  return (
    <section
      id="reviews"
      data-track-section="reviews"
      className="relative overflow-hidden bg-ink py-section-y text-bone"
    >
      <div
        className="absolute inset-0 opacity-20 transition-[background] duration-[800ms] ease-out"
        style={{ background: `linear-gradient(145deg,${tint[0]},${tint[1]})` }}
      />

      <div className="relative mx-auto max-w-shell px-gutter">
        <SectionLabel num="07" label="In their words" dark />

        <div className="grid grid-cols-1">
          {REVIEWS.map((r, n) => (
            <motion.figure
              key={r.name}
              className="col-start-1 row-start-1 m-0"
              animate={{
                opacity: n === i ? 1 : 0,
                y: n === i ? 0 : 12,
                visibility: n === i ? "visible" : "hidden",
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              aria-hidden={n !== i}
            >
              <blockquote className="m-0 max-w-[22ch] font-display text-quote font-normal leading-[1.1] tracking-[-0.02em]">
                {r.quote}
              </blockquote>
              <figcaption className="mt-[26px] text-[10px] uppercase tracking-[0.2em] text-blush">
                {r.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-[clamp(24px,4vh,40px)] flex gap-2 border-t border-bone/20 pt-[22px]">
          {REVIEWS.map((r, n) => (
            <button
              key={r.name}
              type="button"
              aria-label={`Show review ${n + 1}`}
              onClick={() => show(n)}
              className="h-0.5 w-[38px] cursor-pointer border-none p-0 transition-colors duration-[350ms]"
              style={{ background: n === i ? "#E7A79F" : "rgba(247,242,236,0.28)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
