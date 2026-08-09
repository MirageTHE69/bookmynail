import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Local dev uses a SQLite file; production points the same code at Turso by
 * setting DATABASE_URL to a libsql:// URL (plus DATABASE_AUTH_TOKEN).
 */
const url = process.env.DATABASE_URL ?? "file:./data/bookmynail.db";

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export { schema };
