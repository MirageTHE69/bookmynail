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

/** Preview sizes for the heatmap, matching the tracker's device buckets. */
export const DEVICE_SIZES = {
  mobile: { w: 390, h: 780 },
  tablet: { w: 820, h: 1000 },
  desktop: { w: 1440, h: 900 },
} as const;
export type DeviceKey = keyof typeof DEVICE_SIZES;

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

/* ── Heatmap ───────────────────────────────────────────────────────── */

export async function getClickPoints(path: string, device: DeviceKey, range: RangeKey) {
  const r = await rows(sql`
    SELECT x_ratio AS x, y_px AS y, doc_h AS h, target_label AS label
    FROM events
    WHERE type='click' AND path=${path} AND device=${device} AND ts >= ${since(range)}
      AND x_ratio IS NOT NULL AND y_px IS NOT NULL
    LIMIT 20000
  `);
  return r.map((p) => ({
    x: Number(p.x),
    y: n(p.y),
    h: n(p.h),
    label: p.label ? String(p.label) : "",
  }));
}

/** Per-section engagement — the core CRO table. */
export async function getSectionStats(path: string, range: RangeKey) {
  const from = since(range);

  const [tot] = await rows(sql`
    SELECT COUNT(DISTINCT session_id) AS s FROM events WHERE path=${path} AND ts >= ${from}
  `);
  const totalSessions = n(tot?.s) || 1;

  const r = await rows(sql`
    SELECT section,
      SUM(CASE WHEN type='click' THEN 1 ELSE 0 END)  AS clicks,
      SUM(CASE WHEN type='hover' THEN 1 ELSE 0 END)  AS hovers,
      AVG(CASE WHEN type='section_dwell' THEN value END) AS dwell,
      COUNT(DISTINCT CASE WHEN type='section_dwell' THEN session_id END) AS reached
    FROM events
    WHERE path=${path} AND ts >= ${from} AND section IS NOT NULL
    GROUP BY section
  `);

  return r
    .map((s) => ({
      section: String(s.section),
      clicks: n(s.clicks),
      hovers: n(s.hovers),
      dwellMs: Math.round(n(s.dwell)),
      reach: Math.min(100, Math.round((n(s.reached) / totalSessions) * 100)),
    }))
    .sort((a, b) => b.clicks - a.clicks);
}

/** How far down the page people actually get. */
export async function getScrollFunnel(path: string, range: RangeKey) {
  const from = since(range);
  const [tot] = await rows(sql`
    SELECT COUNT(DISTINCT session_id) AS s
    FROM events WHERE path=${path} AND type='scroll' AND ts >= ${from}
  `);
  const total = n(tot?.s) || 1;

  const steps = [25, 50, 75, 100];
  const out: { depth: number; sessions: number; pct: number }[] = [];
  for (const d of steps) {
    const [row] = await rows(sql`
      SELECT COUNT(DISTINCT session_id) AS s
      FROM events WHERE path=${path} AND type='scroll' AND value >= ${d} AND ts >= ${from}
    `);
    out.push({ depth: d, sessions: n(row?.s), pct: Math.round((n(row?.s) / total) * 100) });
  }
  return out;
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
  const map = new Map<string, { id: string; interactions: number; leads: number; value: number }>();
  for (const i of interactions)
    map.set(String(i.id), { id: String(i.id), interactions: n(i.n), leads: 0, value: 0 });
  for (const l of leadsBy) {
    const key = String(l.id);
    const cur = map.get(key) ?? { id: key, interactions: 0, leads: 0, value: 0 };
    cur.leads = n(l.n);
    cur.value = n(l.value);
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.interactions - a.interactions);
}

export async function getTopElements(path: string, range: RangeKey) {
  const r = await rows(sql`
    SELECT COALESCE(target_id, target_label) AS label,
           target_id AS id,
           section,
           COUNT(*) AS n
    FROM events
    WHERE type='click' AND path=${path} AND ts >= ${since(range)}
    GROUP BY label ORDER BY n DESC LIMIT 15
  `);
  return r.map((e) => ({
    label: String(e.label ?? "—"),
    id: e.id ? String(e.id) : null,
    section: e.section ? String(e.section) : "—",
    clicks: n(e.n),
  }));
}

export async function getTrackedPaths() {
  const r = await rows(sql`
    SELECT DISTINCT path FROM events WHERE type='pageview' ORDER BY path
  `);
  const found = r.map((p) => String(p.path));
  // Always offer the three public routes, even before any traffic lands.
  return Array.from(new Set(["/", "/services", "/portfolio", ...found]));
}
