import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { events, DEVICES, EVENT_TYPES } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Event = z.object({
  type: z.enum(EVENT_TYPES),
  section: z.string().max(64).nullish(),
  targetId: z.string().max(64).nullish(),
  targetLabel: z.string().max(120).nullish(),
  xRatio: z.number().min(0).max(1).optional(),
  yPx: z.number().int().min(0).max(500_000).optional(),
  docH: z.number().int().min(0).max(500_000).optional(),
  value: z.number().min(0).max(10_000_000).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const Batch = z.object({
  visitorId: z.string().min(8).max(64),
  sessionId: z.string().min(8).max(64),
  path: z.string().max(200),
  vw: z.number().int().positive().max(20000),
  vh: z.number().int().positive().max(20000),
  device: z.enum(DEVICES),
  events: z.array(Event).min(1).max(100),
});

export async function POST(req: Request) {
  try {
    const parsed = Batch.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    const b = parsed.data;
    const ts = Math.floor(Date.now() / 1000);

    await db.insert(events).values(
      b.events.map((e) => ({
        ts,
        sessionId: b.sessionId,
        visitorId: b.visitorId,
        path: b.path,
        type: e.type,
        section: e.section ?? null,
        targetId: e.targetId ?? null,
        targetLabel: e.targetLabel ?? null,
        xRatio: e.xRatio ?? null,
        yPx: e.yPx ?? null,
        docH: e.docH ?? null,
        vw: b.vw,
        vh: b.vh,
        device: b.device,
        value: e.value ?? null,
        meta: e.meta ?? null,
      })),
    );

    return NextResponse.json({ ok: true });
  } catch {
    // Analytics must never surface an error to a visitor.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
