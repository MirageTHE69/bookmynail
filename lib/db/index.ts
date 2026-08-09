import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Local dev uses a SQLite file; production points the same code at Turso by
 * setting DATABASE_URL to a libsql:// URL (plus DATABASE_AUTH_TOKEN).
 *
 * The local-file fallback is deliberately dev-only. Falling back during a
 * production build just produces a confusing "unable to open ./data/…" error
 * from deep inside the driver, when the real problem is an unset env var.
 */
const isProd = process.env.NODE_ENV === "production";
const url = process.env.DATABASE_URL ?? (isProd ? "" : "file:./data/bookmynail.db");

if (!url) {
  throw new Error(
    "DATABASE_URL is not set.\n" +
      "Set it (and DATABASE_AUTH_TOKEN) in your host's environment variables — " +
      "on Netlify: Site configuration → Environment variables. " +
      "They must be available at build time too, because the public pages are " +
      "prerendered and read the database during the build.",
  );
}

const isRemote = url.startsWith("libsql://") || url.startsWith("https://");
if (isRemote && !process.env.DATABASE_AUTH_TOKEN) {
  throw new Error(
    `DATABASE_URL points at a remote database (${url}) but DATABASE_AUTH_TOKEN is not set.`,
  );
}

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export { schema };
