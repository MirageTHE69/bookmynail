import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { saveImage } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Customer uploads their UPI payment screenshot.
 *
 * Public and unauthenticated, so it is deliberately narrow:
 *  - the caller must know the booking's own BMN- reference, not just its id;
 *  - it only ever moves a lead to `payment_submitted`. It can never set
 *    `confirmed` — a screenshot is an image and proves nothing, so the owner
 *    confirms against her GPay app from the admin panel instead.
 */

const MAX_BYTES = 8 * 1024 * 1024;
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.n >= MAX_ATTEMPTS && now < rec.until) {
    return NextResponse.json({ ok: false, error: "Too many uploads." }, { status: 429 });
  }
  attempts.set(ip, {
    n: rec && now < rec.until ? rec.n + 1 : 1,
    until: rec && now < rec.until ? rec.until : now + WINDOW_MS,
  });

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: "Unknown booking." }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const reference = String(form.get("reference") ?? "").trim();
  const paymentRef = String(form.get("paymentRef") ?? "").trim().slice(0, 64) || null;
  const file = form.get("screenshot");

  if (!reference) {
    return NextResponse.json({ ok: false, error: "Missing reference." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "Attach a screenshot." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "That is not an image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image is larger than 8MB." }, { status: 400 });
  }

  // Reference must match the id, so a guessed id alone gets nowhere.
  const [lead] = await db
    .select({ id: leads.id, status: leads.status })
    .from(leads)
    .where(and(eq(leads.id, id), eq(leads.reference, reference)));

  if (!lead) {
    return NextResponse.json({ ok: false, error: "Unknown booking." }, { status: 404 });
  }
  if (lead.status === "confirmed" || lead.status === "completed") {
    return NextResponse.json({ ok: true, alreadyConfirmed: true });
  }

  let url: string;
  try {
    url = await saveImage(file, "payments");
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 },
    );
  }

  await db
    .update(leads)
    .set({ screenshotUrl: url, paymentRef, status: "payment_submitted" })
    .where(eq(leads.id, id));

  return NextResponse.json({ ok: true });
}
