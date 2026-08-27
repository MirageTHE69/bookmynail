"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { REVIEWS, REVIEW_INTERVAL_MS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Reviews() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, REVIEW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const current = REVIEWS[index];

  return (
    <section
      id="reviews"
      data-reviews
      className="relative overflow-hidden bg-ink py-section-y text-bone"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20 transition-all duration-800"
        style={{
          background: `linear-gradient(145deg, ${current.tint[0]}, ${current.tint[1]})`,
        }}
      />

      <div className="relative mx-auto max-w-shell px-gutter">
        <SectionLabel num="09" label="In their words" dark />

        <div className="grid grid-cols-1">
          {/* All three stay in the markup and crossfade, as the design does —
              a quote that only exists after hydration is invisible to crawlers. */}
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              className="col-start-1 row-start-1 m-0"
              initial={false}
              animate={{
                opacity: i === index ? 1 : 0,
                y: i === index ? 0 : 14,
                visibility: i === index ? "visible" : "hidden",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              aria-hidden={i !== index}
            >
              <blockquote className="m-0 max-w-[24ch] font-display text-quote font-normal leading-[1.1] tracking-[-0.02em]">
                {r.quote}
              </blockquote>
              <figcaption className="mt-[26px] text-[10px] uppercase tracking-[0.2em] text-blush">
                {r.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Tab indicators */}
        <div className="mt-[clamp(24px,4vh,40px)] flex gap-2 border-t border-white/20 pt-[22px]">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show review ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-0.5 w-[38px] cursor-pointer border-none p-0 transition-colors duration-350"
              style={{
                backgroundColor: i === index ? "#E7A79F" : "rgba(247,242,236,0.28)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
