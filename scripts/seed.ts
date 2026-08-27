import "dotenv/config";
import { db } from "../lib/db";
import { addons, portfolioItems, services, settings } from "../lib/db/schema";
import {
  SEED_ADDONS,
  SEED_PORTFOLIO,
  SEED_SERVICES,
  SEED_SETTINGS,
} from "../lib/seed-data";

/**
 * Idempotent: re-running only fills gaps, so a seed never clobbers edits made
 * in the admin panel.
 */
async function main() {
  const existingServices = await db.select().from(services);
  const haveServices = new Set(existingServices.map((s) => s.id));
  const newServices = SEED_SERVICES.filter((s) => !haveServices.has(s.id));
  if (newServices.length > 0) {
    await db.insert(services).values(newServices.map((s) => ({ ...s, active: true })));
    console.log(`✓ seeded ${newServices.length} new services`);
  } else {
    console.log(`· services already present (${existingServices.length}) — skipped`);
  }

  const existingAddons = await db.select().from(addons);
  const haveAddons = new Set(existingAddons.map((a) => a.id));
  const newAddons = SEED_ADDONS.filter((a) => !haveAddons.has(a.id));
  if (newAddons.length > 0) {
    await db.insert(addons).values(newAddons.map((a) => ({ ...a, active: true })));
    console.log(`✓ seeded ${newAddons.length} new add-ons`);
  } else {
    console.log(`· add-ons already present (${existingAddons.length}) — skipped`);
  }

  const existingPortfolio = await db.select().from(portfolioItems);
  const existingIds = new Set(existingPortfolio.map((p) => p.id));
  const newItems = SEED_PORTFOLIO.filter((p) => !existingIds.has(p.id));
  if (newItems.length > 0) {
    await db.insert(portfolioItems).values(newItems.map((p) => ({ ...p, active: true })));
    console.log(`✓ seeded ${newItems.length} new portfolio items`);
  } else {
    console.log(`· portfolio already present (${existingPortfolio.length}) — skipped`);
  }

  const existingSettings = await db.select().from(settings);
  const have = new Set(existingSettings.map((s) => s.key));
  const missing = Object.entries(SEED_SETTINGS)
    .filter(([k]) => !have.has(k))
    .map(([key, value]) => ({ key, value }));
  if (missing.length) {
    await db.insert(settings).values(missing);
    console.log(`✓ seeded ${missing.length} settings`);
  } else {
    console.log("· settings already present — skipped");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
