"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Grouped so the two jobs stay distinct: watching the business, and editing
 * what the site says. Flat lists of seven items read as undifferentiated.
 */
const GROUPS = [
  {
    label: "Business",
    links: [
      { href: "/admin", label: "Overview", exact: true },
      { href: "/admin/leads", label: "Leads" },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/content", label: "Services", exact: true },
      { href: "/admin/content/addons", label: "Add-ons" },
      { href: "/admin/content/portfolio", label: "Portfolio" },
      { href: "/admin/content/settings", label: "Settings" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  const isActive = (l: { href: string; exact?: boolean }) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href);

  return (
    <aside className="border-b border-white/10 bg-ink text-bone nav:fixed nav:inset-y-0 nav:left-0 nav:w-[228px] nav:overflow-y-auto nav:border-b-0 nav:border-r">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 nav:block nav:px-4 nav:py-6">
        <Link href="/admin" className="no-underline nav:mb-8 nav:block">
          <p className="m-0 font-display text-[19px] leading-none text-bone">BookMyNail</p>
          <p className="m-0 mt-1 text-[9.5px] uppercase tracking-[0.22em] text-bone/40">
            Admin panel
          </p>
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-1 nav:block">
          {GROUPS.map((g) => (
            <div key={g.label} className="nav:mb-6">
              <p className="m-0 hidden text-[9.5px] uppercase tracking-[0.2em] text-bone/30 nav:mb-2 nav:block nav:px-3">
                {g.label}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 nav:block nav:space-y-0.5">
                {g.links.map((l) => {
                  const on = isActive(l);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative block rounded-lg px-3 py-2 text-[13px] no-underline transition-colors ${
                        on
                          ? "bg-white/[0.08] font-medium text-bone"
                          : "text-bone/55 hover:bg-white/[0.04] hover:text-bone/90"
                      }`}
                    >
                      {on && (
                        <span className="absolute inset-y-1.5 left-0 hidden w-[3px] rounded-full bg-terracotta nav:block" />
                      )}
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 nav:ml-0 nav:mt-auto nav:block nav:border-t nav:border-white/10 nav:pt-5">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-[12px] text-bone/45 no-underline transition-colors hover:text-bone"
          >
            View site ↗
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg border-none bg-transparent px-3 py-2 text-left text-[12px] text-bone/45 transition-colors hover:text-bone"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
