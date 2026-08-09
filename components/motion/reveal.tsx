"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/**
 * The export drives its reveals with CSS `animation-timeline: view()`, which is
 * Chromium-only. These rebuild the same keyframes on Framer Motion so they also
 * run in Safari and Firefox. Durations, easings and offsets are unchanged.
 *
 * Inside a hero the export switches to `animation-timeline: auto` with a fixed
 * delay — pass `hero` to animate on mount instead of on scroll.
 *
 * IMPORTANT: the scroll trigger always sits on an *untransformed wrapper*, and
 * the moving element is a child driven by variant propagation. Observing the
 * moving element directly deadlocks: `rise` parks it outside an
 * `overflow:hidden` parent and `rule` scales it to zero width, so
 * IntersectionObserver — which honours ancestor clipping — reports 0% forever
 * and the reveal never fires.
 */

const EDITORIAL = [0.16, 1, 0.3, 1] as const;

/** Approximates `animation-range: entry 0% entry 60%`. */
const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Animate on mount rather than on scroll (the export's `[data-hero]` rule). */
  hero?: boolean;
  delay?: number;
};

/**
 * Props for the observed wrapper. Under reduced motion it resolves straight to
 * the shown state — dropping the props instead would strand whatever `initial`
 * style framer had already written inline, hiding the content permanently.
 */
function useTrigger(hero?: boolean) {
  const reduce = useReducedMotion();
  if (reduce) return { initial: "shown" as const, animate: "shown" as const };
  return hero
    ? { initial: "hidden" as const, animate: "shown" as const }
    : {
        initial: "hidden" as const,
        whileInView: "shown" as const,
        viewport: VIEWPORT,
      };
}

/* ── rise: translateY(105%) → 0, clipped by its own wrapper ────────── */

const riseVariants: Variants = {
  hidden: { y: "105%" },
  shown: (delay: number) => ({
    y: "0%",
    transition: { duration: 1.05, ease: EDITORIAL, delay },
  }),
};

export function Rise({
  children,
  className = "",
  innerClassName = "",
  style,
  hero,
  delay = hero ? 0.15 : 0,
}: RevealProps & { innerClassName?: string }) {
  const trigger = useTrigger(hero);
  return (
    <motion.span
      className={`block overflow-hidden ${className}`}
      style={style}
      {...trigger}
    >
      <motion.span className={`block ${innerClassName}`} variants={riseVariants} custom={delay}>
        {children}
      </motion.span>
    </motion.span>
  );
}

/* ── soft: fade up 20px ────────────────────────────────────────────── */

const softVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut", delay },
  }),
};

/**
 * Applied to the element itself rather than a wrapper: it only ever fades and
 * nudges, so it always keeps enough area for the observer, and many callers
 * rely on this being the real grid/flex child.
 */
export function Soft({
  children,
  className = "",
  style,
  hero,
  delay = hero ? 0.5 : 0,
  as = "div",
}: RevealProps & { as?: "div" | "span" | "p" | "h3" | "li" }) {
  const trigger = useTrigger(hero);
  const Tag = motion[as];
  return (
    <Tag className={className} style={style} variants={softVariants} custom={delay} {...trigger}>
      {children}
    </Tag>
  );
}

/* ── wipe: clip-path reveal downward ───────────────────────────────── */

const wipeVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  shown: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1.1, ease: EDITORIAL, delay },
  }),
};

export function Wipe({
  children,
  className = "",
  style,
  hero,
  delay = hero ? 0.3 : 0,
}: RevealProps) {
  const trigger = useTrigger(hero);
  return (
    <motion.div className={className} style={style} {...trigger}>
      <motion.div className="h-full w-full" variants={wipeVariants} custom={delay}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── card: the Portfolio tile reveal (clip + lift) ─────────────────── */

const cardVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 24 },
  shown: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.9, ease: EDITORIAL, delay },
  }),
};

export function Card({ children, className = "", style, delay = 0 }: RevealProps) {
  const trigger = useTrigger(false);
  return (
    <motion.figure className={className} style={style} {...trigger}>
      <motion.div
        className="relative h-full w-full overflow-hidden"
        variants={cardVariants}
        custom={delay}
      >
        {children}
      </motion.div>
    </motion.figure>
  );
}

/* ── rule: a hairline growing from the left ────────────────────────── */

const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  shown: (delay: number) => ({
    scaleX: 1,
    transition: { duration: 1, ease: EDITORIAL, delay },
  }),
};

export function Rule({ className = "", style, delay = 0 }: Omit<RevealProps, "children">) {
  const trigger = useTrigger(false);
  return (
    <motion.div aria-hidden className={className} {...trigger}>
      <motion.div
        className="h-full w-full"
        style={{ transformOrigin: "left center", ...style }}
        variants={ruleVariants}
        custom={delay}
      />
    </motion.div>
  );
}
