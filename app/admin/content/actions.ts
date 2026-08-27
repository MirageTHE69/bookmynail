"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { addons, portfolioItems, services, settings } from "@/lib/db/schema";
import { TAGS } from "@/lib/queries";
import { saveImage } from "@/lib/storage";

/**
 * Content mutations. These run as POSTs to /admin/* routes, which the auth
 * middleware already guards, and each one revalidates the cache tag its data
 * feeds so the public pages update immediately.
 */

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => Number(fd.get(k) ?? 0) || 0;
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

/* ── Services ──────────────────────────────────────────────────────── */

export async function saveService(fd: FormData) {
  const id = str(fd, "id");
  if (!id) throw new Error("A service id is required.");

  const values = {
    id,
    num: str(fd, "num") || "01",
    name: str(fd, "name"),
    suffix: str(fd, "suffix") || null,
    price: num(fd, "price"),
    minutes: num(fd, "minutes"),
    body: str(fd, "body"),
    bullets: str(fd, "bullets")
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean),
    bulletColor: str(fd, "bulletColor") || "#BF5634",
    blurb: str(fd, "blurb"),
    gradFrom: str(fd, "gradFrom") || "#56203C",
    gradTo: str(fd, "gradTo") || "#BF5634",
    cardGradFrom: str(fd, "cardGradFrom") || str(fd, "gradFrom") || "#56203C",
    cardGradTo: str(fd, "cardGradTo") || str(fd, "gradTo") || "#BF5634",
    accent: str(fd, "accent") || "#56203C",
    // Without this an edit would silently reset a lash service to "nails".
    category: (["nails", "lashes", "lash-extra"].includes(str(fd, "category"))
      ? str(fd, "category")
      : "nails") as "nails" | "lashes" | "lash-extra",
    sortOrder: num(fd, "sortOrder"),
    active: bool(fd, "active"),
  };

  const existing = await db.select().from(services).where(eq(services.id, id));
  if (existing.length) {
    await db.update(services).set(values).where(eq(services.id, id));
  } else {
    await db.insert(services).values(values);
  }
  revalidateTag(TAGS.services);
}

/**
 * Services are soft-deleted. Historical leads reference a service id, and
 * hiding rather than removing keeps those records resolvable.
 */
export async function setServiceActive(id: string, active: boolean) {
  await db.update(services).set({ active }).where(eq(services.id, id));
  revalidateTag(TAGS.services);
}

/* ── Add-ons ───────────────────────────────────────────────────────── */

export async function saveAddon(fd: FormData) {
  const id = str(fd, "id");
  if (!id) throw new Error("An add-on id is required.");
  const values = {
    id,
    label: str(fd, "label"),
    price: num(fd, "price"),
    on: (str(fd, "on") === "lashes" ? "lashes" : "nails") as "nails" | "lashes",
    sortOrder: num(fd, "sortOrder"),
    active: bool(fd, "active"),
  };
  const existing = await db.select().from(addons).where(eq(addons.id, id));
  if (existing.length) {
    await db.update(addons).set(values).where(eq(addons.id, id));
  } else {
    await db.insert(addons).values(values);
  }
  revalidateTag(TAGS.addons);
}

export async function setAddonActive(id: string, active: boolean) {
  await db.update(addons).set({ active }).where(eq(addons.id, id));
  revalidateTag(TAGS.addons);
}

/* ── Portfolio ─────────────────────────────────────────────────────── */

export async function createPortfolioItem(fd: FormData) {
  const file = fd.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload.");
  }
  const imageUrl = await saveImage(file);

  await db.insert(portfolioItems).values({
    id: `p-${Date.now().toString(36)}`,
    imageUrl,
    category: str(fd, "category") || "Nail Art",
    span: num(fd, "span") === 2 ? 2 : 1,
    sortOrder: num(fd, "sortOrder"),
    active: true,
  });
  revalidateTag(TAGS.portfolio);
}

export async function updatePortfolioItem(fd: FormData) {
  const id = str(fd, "id");
  await db
    .update(portfolioItems)
    .set({
      category: str(fd, "category"),
      span: num(fd, "span") === 2 ? 2 : 1,
      sortOrder: num(fd, "sortOrder"),
      active: bool(fd, "active"),
    })
    .where(eq(portfolioItems.id, id));
  revalidateTag(TAGS.portfolio);
}

export async function deletePortfolioItem(id: string) {
  await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  revalidateTag(TAGS.portfolio);
}

/* ── Settings ──────────────────────────────────────────────────────── */

export async function saveSettings(fd: FormData) {
  const keys = ["whatsapp", "instagram", "serviceArea", "hours", "eventRetentionDays"];
  for (const key of keys) {
    const value = str(fd, key);
    if (!fd.has(key)) continue;
    const existing = await db.select().from(settings).where(eq(settings.key, key));
    if (existing.length) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }
  revalidateTag(TAGS.settings);
}
