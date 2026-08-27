import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Content tables are seeded from the constants that used to live in `lib/site.ts`,
 * so the public site renders identically after the move.
 */

export const SERVICE_CATEGORIES = ["nails", "lashes", "lash-extra"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const ADDON_SCOPES = ["nails", "lashes"] as const;
export type AddonScope = (typeof ADDON_SCOPES)[number];

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  num: text("num").notNull(),
  name: text("name").notNull(),
  suffix: text("suffix"),
  price: integer("price").notNull(),
  minutes: integer("minutes").notNull(),
  /** Homepage accordion body copy. */
  body: text("body").notNull(),
  /** JSON string[] — the accordion's three bullets. */
  bullets: text("bullets", { mode: "json" }).$type<string[]>().notNull(),
  bulletColor: text("bullet_color").notNull(),
  /** Services-page card copy. */
  blurb: text("blurb").notNull(),
  gradFrom: text("grad_from").notNull(),
  gradTo: text("grad_to").notNull(),
  cardGradFrom: text("card_grad_from").notNull(),
  cardGradTo: text("card_grad_to").notNull(),
  accent: text("accent").notNull(),
  /** Groups the booking menu and the admin content page. */
  category: text("category").$type<ServiceCategory>().notNull().default("nails"),
  sortOrder: integer("sort_order").notNull().default(0),
  /** Soft delete: historical leads must keep resolving their service. */
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const addons = sqliteTable("addons", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  price: integer("price").notNull(),
  /** Which menu the add-on belongs to; the booking form filters on it. */
  on: text("on").$type<AddonScope>().notNull().default("nails"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  /** Row span in the masonry grid when the "All" filter is active. */
  span: integer("span").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

/* ── Leads ─────────────────────────────────────────────────────────── */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at").notNull(),
    /** Shown to the customer on confirmation, e.g. BMN-481920. */
    reference: text("reference"),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    area: text("area"),
    address: text("address").notNull(),
    notes: text("notes"),
    serviceId: text("service_id").notNull(),
    serviceName: text("service_name").notNull(),
    /** JSON of {id,label,price} at time of booking — prices may change later. */
    addons: text("addons", { mode: "json" })
      .$type<{ id: string; label: string; price: number }[]>()
      .notNull(),
    people: integer("people").notNull().default(1),
    preferredDate: text("preferred_date"),
    preferredTime: text("preferred_time"),
    estimatedTotal: integer("estimated_total").notNull(),
    discount: integer("discount").notNull().default(0),
    status: text("status").$type<LeadStatus>().notNull().default("new"),
    adminNotes: text("admin_notes"),
    source: text("source").notNull().default("services-form"),
    sessionId: text("session_id"),
  },
  (t) => ({
    byCreated: index("leads_created_idx").on(t.createdAt),
    byStatus: index("leads_status_idx").on(t.status, t.createdAt),
  }),
);

/* ── Analytics ─────────────────────────────────────────────────────── */

export const EVENT_TYPES = [
  "pageview",
  "click",
  "hover",
  "section_dwell",
  "scroll",
  "service_interaction",
  "form_step",
  "lead",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const DEVICES = ["mobile", "tablet", "desktop"] as const;
export type Device = (typeof DEVICES)[number];

/**
 * One row per interaction. Storing `xRatio` + `yPx` + `docH` + `device` is what
 * lets the admin replay clicks accurately at any preview width: x scales by the
 * preview width, y by (previewDocH / recordedDocH), bucketed per device.
 */
export const events = sqliteTable(
  "events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ts: integer("ts").notNull(),
    sessionId: text("session_id").notNull(),
    visitorId: text("visitor_id").notNull(),
    path: text("path").notNull(),
    type: text("type").$type<EventType>().notNull(),
    section: text("section"),
    targetId: text("target_id"),
    targetLabel: text("target_label"),
    xRatio: real("x_ratio"),
    yPx: integer("y_px"),
    docH: integer("doc_h"),
    vw: integer("vw"),
    vh: integer("vh"),
    device: text("device").$type<Device>(),
    /** Dwell in ms, or scroll depth %. */
    value: real("value"),
    meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
  },
  (t) => ({
    byPathType: index("events_path_type_idx").on(t.path, t.type, t.ts),
    bySection: index("events_section_idx").on(t.section, t.ts),
    byTs: index("events_ts_idx").on(t.ts),
    bySession: index("events_session_idx").on(t.sessionId),
  }),
);
