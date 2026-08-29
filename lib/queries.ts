import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { addons, portfolioItems, services, settings } from "@/lib/db/schema";
import { SEED_SETTINGS } from "@/lib/seed-data";
import {
  CATEGORY_LABELS,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_ITEMS,
  type Addon,
  type PortfolioCategory,
  type PortfolioItem,
  type Service,
} from "@/lib/site";

/**
 * Cached reads for the public site. Every admin mutation calls
 * `revalidateTag` with the matching tag, so edits appear without a rebuild.
 *
 * Rows are mapped back into the exact shapes the existing components expect,
 * so nothing downstream had to change when content moved into the database.
 */

export const TAGS = {
  services: "services",
  addons: "addons",
  portfolio: "portfolio",
  settings: "settings",
} as const;

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.sortOrder));

    return rows.map((r) => ({
      id: r.id,
      num: r.num,
      name: r.name,
      suffix: r.suffix ?? undefined,
      price: r.price,
      minutes: r.minutes,
      body: r.body,
      bullets: r.bullets,
      bulletColor: r.bulletColor,
      blurb: r.blurb,
      grad: [r.gradFrom, r.gradTo],
      cardGrad: [r.cardGradFrom, r.cardGradTo],
      accent: r.accent,
      category: r.category,
    }));
  },
  ["services"],
  { tags: [TAGS.services] },
);

export const getAddons = unstable_cache(
  async (): Promise<Addon[]> => {
    const rows = await db
      .select()
      .from(addons)
      .where(eq(addons.active, true))
      .orderBy(asc(addons.sortOrder));
    return rows.map((r) => ({ id: r.id, label: r.label, price: r.price, on: r.on }));
  },
  ["addons"],
  { tags: [TAGS.addons] },
);

export const getPortfolioItems = unstable_cache(
  async (): Promise<PortfolioItem[]> => {
    const rows = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.active, true))
      .orderBy(asc(portfolioItems.sortOrder));
    if (rows.length === 0) {
      return PORTFOLIO_ITEMS;
    }
    return rows.map((r) => {
      const match = PORTFOLIO_ITEMS.find((p) => p.id === r.id);
      const category = (
        PORTFOLIO_CATEGORIES.includes(r.category as PortfolioCategory)
          ? r.category
          : "Bridal"
      ) as PortfolioCategory;
      const label = CATEGORY_LABELS[category] ?? category;
      return {
        id: r.id,
        src: r.imageUrl,
        category,
        title: match?.title ?? label,
        // Rows added through admin carry no caption; describing the work beats
        // a bare category name for screen readers and image search.
        alt: match?.alt ?? `${label} by BookMyNail`,
      };
    });
  },
  ["portfolio"],
  { tags: [TAGS.portfolio] },
);

export type SiteSettings = {
  whatsapp: string;
  instagram: string;
  /** UPI id money is collected into. Empty until the owner sets it. */
  upiId: string;
  upiName: string;
  depositType: "fixed" | "percent";
  depositValue: string;
  serviceArea: string;
  hours: string;
  eventRetentionDays: string;
};

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const rows = await db.select().from(settings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...SEED_SETTINGS, ...map } as SiteSettings;
  },
  ["settings"],
  { tags: [TAGS.settings] },
);

/* ── Derived helpers (were computed from the old constants) ────────── */

/** Homepage chip strip: priced add-ons plus the non-bookable group-discount chip. */
export function addonChips(list: Addon[]): string[] {
  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  return [...list.map((a) => `${a.label} · ${inr(a.price)}`), "Second person · 15% off"];
}

/** "All" plus only those categories that currently have work behind them. */
export function portfolioFilters(items: PortfolioItem[]): string[] {
  return ["All", ...Array.from(new Set(items.map((i) => i.category)))];
}

/* ── Booking menu grouping ─────────────────────────────────────────── */

/** Nail services only — the homepage accordion and the Services card grid. */
export const nailServices = (all: Service[]) => all.filter((s) => s.category === "nails");

/** The four bookable lash sets. */
export const lashServices = (all: Service[]) => all.filter((s) => s.category === "lashes");

/** Lift, tint and removal — priced separately from the mapped sets. */
export const lashExtras = (all: Service[]) => all.filter((s) => s.category === "lash-extra");

/** The booking form offers everything. */
export const bookableServices = (all: Service[]) => all;

/** Add-ons shown for a given service, based on which menu it belongs to. */
export function addonsFor(all: Addon[], category: Service["category"]): Addon[] {
  return all.filter((a) => a.on === (category === "nails" ? "nails" : "lashes"));
}

/* ── Gallery composition ───────────────────────────────────────────── */

/**
 * Round-robin across categories instead of concatenating them.
 *
 * Lash work is a much smaller set than nails, so a plain sort buries it at
 * the end and nobody scrolls that far. Taking one from each category in turn
 * puts a lash set in the first few tiles while keeping the order stable —
 * no randomness, so the server and client render the same thing.
 */
export function interleaveByCategory<T extends { category: string }>(items: T[]): T[] {
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const list = buckets.get(item.category);
    if (list) list.push(item);
    else buckets.set(item.category, [item]);
  }

  // Largest category first, so the dominant work still leads.
  const queues = Array.from(buckets.values()).sort((a, b) => b.length - a.length);

  const out: T[] = [];
  for (let i = 0; out.length < items.length; i++) {
    let placed = false;
    for (const q of queues) {
      if (i < q.length) {
        out.push(q[i]);
        placed = true;
      }
    }
    if (!placed) break;
  }
  return out;
}

/**
 * The homepage rail. The export alternates a tall 3/4 card with an offset
 * square one, and swaps which end the arch sits on every other tall card —
 * that rhythm is positional, so it is applied by index rather than stored.
 */
export function galleryShape(i: number) {
  const tall = i % 2 === 0;
  if (!tall) return { ratio: "1/1", radius: "8px", low: true } as const;
  const topArch = Math.floor(i / 2) % 2 === 0;
  return {
    ratio: "3/4",
    radius: topArch ? "150px 150px 8px 8px" : "8px 8px 150px 150px",
    low: false,
  } as const;
}
