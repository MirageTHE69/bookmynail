import type { Config } from "drizzle-kit";
import "dotenv/config";

/**
 * One config for both targets. A `file:` URL is plain SQLite; a `libsql://`
 * URL is Turso, which drizzle-kit treats as its own dialect and which also
 * needs an auth token.
 */
const url = process.env.DATABASE_URL ?? "file:./data/bookmynail.db";
const isRemote = url.startsWith("libsql://") || url.startsWith("https://");

export default (
  isRemote
    ? {
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "turso",
        dbCredentials: { url, authToken: process.env.DATABASE_AUTH_TOKEN },
      }
    : {
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "sqlite",
        dbCredentials: { url },
      }
) satisfies Config;
