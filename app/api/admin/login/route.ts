import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SESSION_COOKIE, SESSION_MAX_AGE, adminPasswordHash, createSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ email: z.string().max(160), password: z.string().max(200) });

/** In-memory throttle. Enough for a single-admin panel. */
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCK_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.n >= MAX_ATTEMPTS && now < rec.until) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const expectedEmail = process.env.ADMIN_EMAIL;
  const hash = adminPasswordHash();

  if (!expectedEmail || !hash) {
    return NextResponse.json(
      { ok: false, error: "Admin is not configured. Run `npm run admin:create`." },
      { status: 500 },
    );
  }

  // Always run the hash comparison so a wrong email and a wrong password take
  // the same time and can't be told apart.
  const passwordOk = await bcrypt.compare(password, hash);
  const ok = passwordOk && email.toLowerCase().trim() === expectedEmail.toLowerCase().trim();

  if (!ok) {
    const next = rec && now < rec.until ? rec.n + 1 : 1;
    attempts.set(ip, { n: next, until: now + LOCK_MS });
    return NextResponse.json(
      { ok: false, error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  attempts.delete(ip);
  const token = await createSession(expectedEmail);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
