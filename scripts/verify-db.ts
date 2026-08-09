import { createClient } from "@libsql/client";

async function main() {
  const c = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  console.log("target:", process.env.DATABASE_URL);

  const tables = await c.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );
  console.log("\ntables:", tables.rows.map((r) => r.name).join(", "));

  for (const t of ["services", "addons", "portfolio_items", "settings", "leads", "events"]) {
    const r = await c.execute(`SELECT COUNT(*) AS n FROM ${t}`);
    console.log(`  ${t.padEnd(16)} ${r.rows[0].n} rows`);
  }

  const s = await c.execute("SELECT name, price, minutes, active FROM services ORDER BY sort_order");
  console.log("\nservices:");
  for (const r of s.rows) {
    console.log(`  ${String(r.name).padEnd(18)} Rs${r.price}  ${r.minutes}min  active=${r.active}`);
  }

  const j = await c.execute("SELECT bullets FROM services LIMIT 1");
  const b = JSON.parse(String(j.rows[0].bullets));
  console.log("\njson round-trip:", Array.isArray(b) ? `array(${b.length}) -> "${b[0]}"` : "FAILED");

  const set = await c.execute("SELECT key, value FROM settings ORDER BY key");
  console.log("\nsettings:");
  for (const r of set.rows) {
    console.log(`  ${String(r.key).padEnd(20)} ${String(r.value).split("\n")[0]}`);
  }

  const idx = await c.execute(
    "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE '%_idx' ORDER BY name",
  );
  console.log("\nindexes:", idx.rows.map((r) => r.name).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
