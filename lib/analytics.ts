import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Aggregate reads for the admin dashboards. All of these are read-only and
 * intentionally uncached — the admin should always see current numbers.
 */

export const RANGES = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  all: 36500,
} as const;
export type RangeKey = keyof typeof RANGES;

export function since(range: RangeKey) {
  return Math.floor(Date.now() / 1000) - RANGES[range] * 86400;
}

type Row = Record<string, unknown>;
const rows = async (q: ReturnType<typeof sql>) => (await db.all(q)) as Row[];
const n = (v: unknown) => Number(v ?? 0);

/* ── Overview ──────────────────────────────────────────────────────── */

export async function getOverview(range: RangeKey) {
  const from = since(range);

  const [totals] = await rows(sql`
    SELECT
      COUNT(DISTINCT session_id)                                   AS sessions,
      COUNT(DISTINCT visitor_id)                                   AS visitors,
      SUM(CASE WHEN type = 'pageview' THEN 1 ELSE 0 END)           AS pageviews,
      SUM(CASE WHEN type = 'click'    THEN 1 ELSE 0 END)           AS clicks
    FROM events WHERE ts >= ${from}
  `);

  const [leadCount] = await rows(sql`
    SELECT COUNT(*) AS c, COALESCE(SUM(estimated_total),0) AS value
    FROM leads WHERE created_at >= ${from}
  `);

  const pages = await rows(sql`
    SELECT path,
           COUNT(DISTINCT session_id) AS sessions,
           SUM(CASE WHEN type='pageview' THEN 1 ELSE 0 END) AS views,
           SUM(CASE WHEN type='click' THEN 1 ELSE 0 END)    AS clicks
    FROM events WHERE ts >= ${from}
    GROUP BY path ORDER BY views DESC LIMIT 10
  `);

  const devices = await rows(sql`
    SELECT device, COUNT(DISTINCT session_id) AS sessions
    FROM events WHERE ts >= ${from} AND device IS NOT NULL
    GROUP BY device
  `);

  const daily = await rows(sql`
    SELECT date(ts,'unixepoch') AS day,
           COUNT(DISTINCT session_id) AS sessions,
           SUM(CASE WHEN type='pageview' THEN 1 ELSE 0 END) AS views
    FROM events WHERE ts >= ${from}
    GROUP BY day ORDER BY day
  `);

  const sessions = n(totals?.sessions);
  const leads = n(leadCount?.c);

  return {
    sessions,
    visitors: n(totals?.visitors),
    pageviews: n(totals?.pageviews),
    clicks: n(totals?.clicks),
    leads,
    leadValue: n(leadCount?.value),
    // The number that matters: how many visits turn into a booking request.
    conversion: sessions ? (leads / sessions) * 100 : 0,
    pages: pages.map((p) => ({
      path: String(p.path),
      sessions: n(p.sessions),
      views: n(p.views),
      clicks: n(p.clicks),
    })),
    devices: devices.map((d) => ({ device: String(d.device), sessions: n(d.sessions) })),
    daily: daily.map((d) => ({ day: String(d.day), sessions: n(d.sessions), views: n(d.views) })),
  };
}

/** Which services get opened, and which of those turn into leads. */
export async function getServiceStats(range: RangeKey) {
  const from = since(range);
  const interactions = await rows(sql`
    SELECT target_id AS id, COUNT(*) AS n
    FROM events WHERE type='service_interaction' AND ts >= ${from} AND target_id IS NOT NULL
    GROUP BY target_id
  `);
  const leadsBy = await rows(sql`
    SELECT service_id AS id, COUNT(*) AS n, COALESCE(SUM(estimated_total),0) AS value
    FROM leads WHERE created_at >= ${from} GROUP BY service_id
  `);
  // Resolve display names, otherwise the dashboard shows raw ids like "biab".
  const named = await rows(sql`SELECT id, name, category FROM services`);
  const nameOf = new Map(named.map((r) => [String(r.id), String(r.name)]));
  const catOf = new Map(named.map((r) => [String(r.id), String(r.category)]));

  type Row = {
    id: string;
    name: string;
    category: string;
    interactions: number;
    leads: number;
    value: number;
  };
  const blank = (id: string): Row => ({
    id,
    name: nameOf.get(id) ?? id,
    category: catOf.get(id) ?? "nails",
    interactions: 0,
    leads: 0,
    value: 0,
  });

  const map = new Map<string, Row>();
  for (const i of interactions) {
    const key = String(i.id);
    map.set(key, { ...blank(key), interactions: n(i.n) });
  }
  for (const l of leadsBy) {
    const key = String(l.id);
    const cur = map.get(key) ?? blank(key);
    cur.leads = n(l.n);
    cur.value = n(l.value);
    map.set(key, cur);
  }
  return Array.from(map.values()).sort(
    (a, b) => b.leads - a.leads || b.interactions - a.interactions,
  );
}

export async function getTrackedPaths() {
  const r = await rows(sql`
    SELECT DISTINCT path FROM events WHERE type='pageview' ORDER BY path
  `);
  const found = r.map((p) => String(p.path));
  // Always offer the three public routes, even before any traffic lands.
  return Array.from(new Set(["/", "/services", "/portfolio", ...found]));
}
