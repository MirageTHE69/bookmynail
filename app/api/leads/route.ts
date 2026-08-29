import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Lead = z.object({
  reference: z.string().max(32).optional().nullable(),
  name: z.string().min(1).max(120),
  phone: z.string().min(6).max(30),
  email: z.string().max(160).optional().nullable(),
  area: z.string().max(160).optional().nullable(),
  address: z.string().min(1).max(600),
  notes: z.string().max(1000).optional().nullable(),
  serviceId: z.string().max(40),
  serviceName: z.string().max(120),
  addons: z
    .array(z.object({ id: z.string().max(40), label: z.string().max(80), price: z.number() }))
    .max(20),
  people: z.number().int().min(1).max(20),
  preferredDate: z.string().max(40).optional().nullable(),
  preferredTime: z.string().max(40).optional().nullable(),
  estimatedTotal: z.number().int().min(0),
  discount: z.number().int().min(0).default(0),
  depositAmount: z.number().int().min(0).optional(),
  sessionId: z.string().max(64).optional().nullable(),
});

export async function POST(req: Request) {
  const parsed = Lead.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const [row] = await db
    .insert(leads)
    .values({
      ...parsed.data,
      createdAt: Math.floor(Date.now() / 1000),
      // A deposit was asked for, so the booking is not "new" — it is waiting
      // on money. Without a UPI id configured there is nothing to pay yet.
      status: parsed.data.depositAmount ? "awaiting_payment" : "new",
    })
    .returning({ id: leads.id });

  return NextResponse.json({ ok: true, id: row?.id });
}
