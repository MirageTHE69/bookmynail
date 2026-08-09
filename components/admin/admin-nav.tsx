"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/heatmap", label: "Heatmap" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/content", label: "Services" },
  { href: "/admin/content/addons", label: "Add-ons" },
  { href: "/admin/content/portfolio", label: "Portfolio" },
  { href: "/admin/content/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  const active = (l: (typeof LINKS)[number]) =>
    l.exact ? pathname === l.href : pathname === l.href;

  return (
    <aside className="border-b border-ink/10 bg-ink text-bone nav:fixed nav:inset-y-0 nav:left-0 nav:w-[220px] nav:border-b-0 nav:border-r">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 nav:block">
        <div className="nav:mb-7">
          <p className="m-0 font-display text-lg text-bone">BookMyNail</p>
          <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-bone/45">Admin</p>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-1 nav:block nav:space-y-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-md px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] no-underline transition-colors ${
                active(l) ? "bg-terracotta text-bone" : "text-bone/60 hover:text-bone"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 nav:ml-0 nav:mt-8 nav:block nav:space-y-2">
          <Link
            href="/"
            target="_blank"
            className="block text-[11px] uppercase tracking-[0.14em] text-bone/50 no-underline hover:text-bone"
          >
            View site ↗
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="cursor-pointer border-none bg-transparent p-0 text-[11px] uppercase tracking-[0.14em] text-bone/50 hover:text-bone"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
