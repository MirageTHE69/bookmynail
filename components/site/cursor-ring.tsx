"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * The export's `[data-cursor]` ring: a 30px circle in `mix-blend-mode: difference`
 * that trails the pointer and swells to 2.2× over anything interactive.
 * Hidden below 761px, on coarse pointers, and under reduced motion.
 */
export default function CursorRing() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [big, setBig] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Approximates gsap.quickTo's 0.4s power3 follow.
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.45 });

  useEffect(() => {
    // The ring is marketing polish; the admin panel is a tool.
    if (reduce || pathname?.startsWith("/admin")) {
      setEnabled(false);
      return;
    }
    const fine = window.matchMedia("(hover: hover)");
    const wide = window.matchMedia("(min-width: 761px)");
    const sync = () => setEnabled(fine.matches && wide.matches);
    sync();
    fine.addEventListener("change", sync);
    wide.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      wide.removeEventListener("change", sync);
    };
  }, [reduce, pathname]);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 15);
      y.set(e.clientY - 15);
      setVisible(true);
    };
    const leave = () => setVisible(false);

    // Delegated so it covers nodes added later (filtered portfolio tiles, etc.).
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("a, button, [data-value-row]");
    const over = (e: MouseEvent) => {
      if (isInteractive(e.target)) setBig(true);
    };
    const out = (e: MouseEvent) => {
      if (isInteractive(e.target)) setBig(false);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9000] h-[30px] w-[30px] rounded-full border border-bone"
      style={{ x: sx, y: sy, mixBlendMode: "difference" }}
      animate={{ opacity: visible ? 1 : 0, scale: big ? 2.2 : 1 }}
      transition={{ duration: 0.35 }}
    />
  );
}
