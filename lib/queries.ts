import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { addons, portfolioItems, services, settings } from "@/lib/db/schema";
import { SEED_SETTINGS } from "@/lib/seed-data";
import type { Addon, PortfolioItem, Service } from "@/lib/site";

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
    return rows.map((r) => ({ id: r.id, label: r.label, price: r.price }));
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
    return rows.map((r) => ({
      id: r.id,
      src: r.imageUrl,
      category: r.category,
      span: (r.span === 2 ? 2 : 1) as 1 | 2,
    }));
  },
  ["portfolio"],
  { tags: [TAGS.portfolio] },
);

export type SiteSettings = {
  whatsapp: string;
  instagram: string;
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
