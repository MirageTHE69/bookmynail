import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "bmn_admin";
const ISSUER = "bookmynail";
const MAX_AGE_S = 60 * 60 * 12;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set — run `npm run admin:create`");
  return new TextEncoder().encode(s);
}

export async function createSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_S}s`)
    .sign(secret());
}

/** Edge-safe: used by middleware as well as route handlers. */
export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
    return payload as { email: string };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_S;

/**
 * A bcrypt hash is full of `$`, and dotenv runs variable expansion over env
 * values — `$2b$12$…` silently expands to an empty string. So the hash is
 * stored base64-encoded. Raw hashes are still accepted for anyone who escapes
 * them by hand.
 */
export function adminPasswordHash(): string | null {
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!raw) return null;
  if (raw.startsWith("$2")) return raw;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return decoded.startsWith("$2") ? decoded : null;
  } catch {
    return null;
  }
}
