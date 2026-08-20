"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingCTA() {
  const [shown, setShown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA once user scrolls past 300px (or past hero)
      if (window.scrollY > 300) {
        setShown(true);
      } else {
        setShown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const targetHref = pathname === "/services" ? "#book" : "/services#book";

  return (
    <Link
      href={targetHref}
      aria-label="Book an appointment"
      className={`fixed bottom-[clamp(14px,2.4vw,28px)] right-[clamp(14px,2.4vw,28px)] z-[500] flex min-h-[54px] items-center gap-2.5 rounded-full bg-plum px-[22px] text-[11.5px] uppercase tracking-[0.14em] text-bone no-underline shadow-[0_14px_34px_rgba(26,22,20,0.34)] transition-all duration-400 hover:-translate-y-1 hover:bg-terracotta ${
        shown
          ? "translate-y-0 opacity-100 visible"
          : "translate-y-3 opacity-0 invisible pointer-events-none"
      }`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-blush animate-pulse"
      />
      <span className="hidden sm:inline">Book an appointment</span>
    </Link>
  );
}
