import "dotenv/config";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import bcrypt from "bcryptjs";

/**
 * Generates admin credentials and writes them to .env.local.
 * Only the bcrypt hash is stored — the password is printed once and never kept.
 *
 *   npm run admin:create                 → generates a password
 *   npm run admin:create -- me@x.com     → sets the email too
 */
const ENV = ".env.local";

function upsert(content: string, key: string, value: string) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  return re.test(content) ? content.replace(re, line) : `${content.trimEnd()}\n${line}\n`;
}

async function main() {
  const email = process.argv[2] ?? "admin@bookmynail.local";

  // Avoid ambiguous glyphs (0/O, 1/l/I) so the password can be read off a screen.
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(20);
  const password = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");

  // Stored base64: a raw bcrypt hash contains `$`, which dotenv's variable
  // expansion would silently strip to an empty string.
  const hash = Buffer.from(await bcrypt.hash(password, 12), "utf8").toString("base64");
  const secret = randomBytes(32).toString("base64url");

  let env = existsSync(ENV) ? readFileSync(ENV, "utf8") : "";
  env = upsert(env, "ADMIN_EMAIL", email);
  env = upsert(env, "ADMIN_PASSWORD_HASH", hash);
  if (!/^AUTH_SECRET=/m.test(env)) env = upsert(env, "AUTH_SECRET", secret);
  if (!/^DATABASE_URL=/m.test(env)) {
    env = upsert(env, "DATABASE_URL", "file:./data/bookmynail.db");
  }
  writeFileSync(ENV, env);

  console.log(`
┌────────────────────────────────────────────────────────┐
│  BookMyNail admin credentials — saved once, shown once  │
└────────────────────────────────────────────────────────┘

   URL       http://localhost:3000/admin
   Email     ${email}
   Password  ${password}

Store this in your password manager now. Only the hash was written to
${ENV}; the password itself is not recoverable. Re-run this command to
issue a new one.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
