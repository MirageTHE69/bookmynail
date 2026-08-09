"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EDITORIAL = [0.16, 1, 0.3, 1] as const;

/**
 * One nav for every route. Links are absolute so the same set works from any
 * page. Mark a page's hero with `data-nav-boundary` and the bar inverts from
 * bone-on-transparent to ink-on-bone once that hero scrolls past.
 */
export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Values", href: "/#values" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Reviews", href: "/#reviews" },
];

/** The site's single booking entry point — the form that prices before sending. */
export const BOOK_HREF = "/services#book";

export default function SiteNav() {
  const pathname = usePathname();
  const [inverted, setInverted] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const boundary = document.querySelector("[data-nav-boundary]");
    const onScroll = () => {
      const bottom = boundary ? boundary.getBoundingClientRect().bottom : 80;
      setInverted(bottom <= 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close on route change.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 760 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Scroll-spy for the homepage anchors, so exactly one link reads as current.
  const [activeHash, setActiveHash] = useState("");
  useEffect(() => {
    if (pathname !== "/") {
      setActiveHash("");
      return;
    }
    const sections = NAV_LINKS.filter((l) => l.href.startsWith("/#"))
      .map((l) => document.getElementById(l.href.slice(2)))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActiveHash(`/#${hit.target.id}`);
      },
      // Only whatever is crossing the middle band of the viewport counts.
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // The burger sits above the open panel, so it always needs the light colour.
  const barColor = open ? "text-bone" : inverted ? "text-ink" : "text-bone";
  const isCurrent = (href: string) =>
    href.includes("#") ? href === activeHash : pathname === href;

  return (
    <>
      <motion.nav
        className="fixed inset-x-0 top-0 z-[200] flex items-center justify-between gap-6 px-gutter"
        initial={false}
        animate={{
          paddingTop: inverted ? 14 : 26,
          paddingBottom: inverted ? 14 : 26,
          backgroundColor: inverted ? "#F7F2EC" : "rgba(247,242,236,0)",
          borderBottomColor: inverted ? "rgba(26,22,20,0.14)" : "rgba(26,22,20,0)",
        }}
        transition={{ duration: 0.4 }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <Link
          href="/"
          className={`font-display text-[19px] font-medium tracking-[0.01em] no-underline transition-colors duration-[400ms] ${
            inverted ? "text-ink" : "text-bone"
          }`}
        >
          BookMyNail
        </Link>

        <div className="flex items-center gap-[clamp(14px,2.2vw,32px)]">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`hidden border-b pb-[3px] text-[11px] uppercase tracking-[0.18em] no-underline transition-colors duration-[400ms] nav:block ${
                inverted ? "text-ink/70 hover:text-ink" : "text-bone/85 hover:text-bone"
              } ${isCurrent(l.href) ? "border-terracotta" : "border-transparent"}`}
            >
              {l.label}
            </Link>
          ))}

          {/* Stays available on mobile, but yields to the panel's own CTA when open. */}
          <Link
            href={BOOK_HREF}
            className={`rounded-full px-[18px] py-[11px] text-[11px] uppercase tracking-[0.16em] no-underline transition-all duration-300 hover:-translate-y-0.5 nav:inline-block ${
              open ? "hidden" : "inline-block"
            } ${inverted ? "bg-ink text-bone" : "bg-bone text-ink"}`}
          >
            Book now
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={`-my-2 -mr-2 flex h-12 w-12 flex-col items-center justify-center gap-1.5 border-none bg-transparent p-0 transition-colors duration-[400ms] nav:hidden ${barColor}`}
          >
            <motion.span
              className="block h-0.5 w-[26px] bg-current"
              animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.span
              className="block h-0.5 w-[26px] bg-current"
              animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }}
              transition={{ duration: 0.35 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile panel — the only way to reach other pages below 761px. */}
      <motion.div
        className="fixed inset-0 z-[190] flex flex-col justify-center gap-1 bg-ink px-gutter pb-8 pt-[clamp(80px,14vh,120px)] text-bone nav:hidden"
        initial={false}
        animate={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        transition={{ duration: open ? 0.6 : 0.5, ease: EDITORIAL }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
      >
        {NAV_LINKS.map((l, i) => (
          <motion.div
            key={l.label}
            animate={open || reduce ? { y: 0, opacity: 1 } : { y: 26, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: open ? 0.12 + i * 0.06 : 0 }}
          >
            <Link
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[56px] items-center border-b border-bone/20 font-display text-menu-link tracking-[-0.02em] text-bone no-underline"
            >
              {l.label}
            </Link>
          </motion.div>
        ))}

        <motion.div
          animate={open || reduce ? { y: 0, opacity: 1 } : { y: 26, opacity: 0 }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
            delay: open ? 0.12 + NAV_LINKS.length * 0.06 : 0,
          }}
        >
          <Link
            href={BOOK_HREF}
            onClick={() => setOpen(false)}
            className="mt-7 flex min-h-[52px] items-center justify-center rounded-full bg-bone text-[13px] uppercase tracking-[0.12em] text-ink no-underline"
          >
            Book an appointment
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
