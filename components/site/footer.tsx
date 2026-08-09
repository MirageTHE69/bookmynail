"use client";

import Link from "next/link";
import { useSettings } from "@/components/site/settings-provider";

/** One footer for every route, matching the nav's destinations. */
export default function Footer() {
  const { instagram } = useSettings();

  const links = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Instagram", href: instagram, external: true },
  ];

  return (
    <footer data-track-section="footer" className="bg-ink text-bone/60">
      <div className="mx-auto flex max-w-shell flex-wrap items-start justify-between gap-5 px-gutter py-[clamp(28px,5vh,46px)] nav:items-end">
        <div>
          <p className="m-0 mb-2 font-display text-2xl text-bone">BookMyNail</p>
          <p className="m-0 font-display text-sm italic text-bone/70">
            Luxury Nails. Comfort of Home.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[22px] text-[10px] uppercase tracking-[0.18em]">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
              className="border-b border-transparent text-inherit no-underline transition-colors duration-[250ms] hover:border-blush"
            >
              {l.label}
            </Link>
          ))}
          <span>© 2026 BookMyNail · Ahmedabad</span>
        </div>
      </div>
    </footer>
  );
}
