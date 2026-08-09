import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { LEAD_STATUSES, leads } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Patch = z.object({
  id: z.number().int().positive(),
  status: z.enum(LEAD_STATUSES).optional(),
  adminNotes: z.string().max(2000).optional(),
});

export async function PATCH(req: Request) {
  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const { id, ...fields } = parsed.data;
  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ ok: false, error: "nothing to update" }, { status: 400 });
  }
  await db.update(leads).set(fields).where(eq(leads.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: "invalid id" }, { status: 400 });
  }
  await db.delete(leads).where(eq(leads.id, id));
  return NextResponse.json({ ok: true });
}

/** CSV export of everything, newest first. */
export async function GET() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const cols = [
    "id",
    "created",
    "name",
    "phone",
    "email",
    "area",
    "address",
    "service",
    "addons",
    "people",
    "date",
    "time",
    "total",
    "discount",
    "status",
    "notes",
    "adminNotes",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = [
    cols.join(","),
    ...rows.map((l) =>
      [
        l.id,
        new Date(l.createdAt * 1000).toISOString(),
        l.name,
        l.phone,
        l.email,
        l.area,
        l.address,
        l.serviceName,
        l.addons.map((a) => a.label).join("; "),
        l.people,
        l.preferredDate,
        l.preferredTime,
        l.estimatedTotal,
        l.discount,
        l.status,
        l.notes,
        l.adminNotes,
      ]
        .map(esc)
        .join(","),
    ),
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookmynail-leads-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
