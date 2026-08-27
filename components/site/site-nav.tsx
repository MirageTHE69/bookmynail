"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Lashes", href: "/services#lashes" },
  { label: "Gallery", href: "/portfolio" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Lashes", href: "/services#lashes" },
  { label: "Gallery", href: "/portfolio" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-menu-open", "");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-menu-open");
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 760 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <nav
        data-nav
        className={`fixed inset-x-0 top-0 z-[200] flex items-center justify-between gap-6 px-gutter transition-all duration-400 ${
          scrolled
            ? "bg-ink/80 py-4 backdrop-blur-md"
            : "bg-transparent py-[26px]"
        }`}
      >
        <Link
          href="/"
          className="font-display text-[19px] font-medium tracking-[0.01em] text-bone no-underline"
        >
          BookMyNail
        </Link>

        <div className="flex items-center gap-[clamp(14px,2.2vw,32px)]">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href.startsWith("/#") && pathname === "/" && false);

            return (
              <Link
                key={link.label}
                href={link.href}
                data-nav-link
                className={`hidden pb-[3px] text-[11px] uppercase tracking-[0.18em] no-underline transition-all duration-300 nav:inline-block ${
                  isActive
                    ? "border-b border-blush text-blush opacity-100"
                    : "border-b border-transparent text-bone opacity-85 hover:border-blush hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/services#book"
            data-nav-cta
            className="hidden rounded-full bg-bone px-[18px] py-[11px] text-[11px] uppercase tracking-[0.16em] text-ink no-underline transition-transform duration-300 hover:-translate-y-0.5 nav:inline-block"
          >
            Book now
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            data-burger
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-1.5 border-none bg-transparent p-0 text-bone nav:hidden"
          >
            <span
              className={`block h-0.5 w-6 bg-current transition-transform duration-350 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-transform duration-350 ${
                open ? "-translate-y-0 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[190] flex flex-col justify-center gap-0.5 bg-ink p-[clamp(80px,14vh,120px)_clamp(20px,6vw,40px)_32px] text-bone"
          >
            {MENU_LINKS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[58px] items-center border-b border-white/20 font-display text-[clamp(28px,8.5vw,42px)] tracking-[-0.02em] text-bone no-underline"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-[26px]"
            >
              <Link
                href="/services#book"
                onClick={() => setOpen(false)}
                className="flex min-h-[54px] items-center justify-center rounded-full bg-bone text-center text-xs uppercase tracking-[0.14em] text-ink no-underline"
              >
                Book an appointment
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
