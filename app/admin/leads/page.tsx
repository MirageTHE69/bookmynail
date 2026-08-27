import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { LEAD_STATUSES, leads as leadsTable } from "@/lib/db/schema";
import { Empty, Panel, Stat, PageHeader } from "@/components/admin/ui";
import Picker from "@/components/admin/range-picker";
import LeadsTable, { type LeadRow } from "@/components/admin/leads-table";
import { inr } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status ?? "all";
  const all = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  const rows = (status === "all" ? all : all.filter((l) => l.status === status)) as LeadRow[];

  const openCount = all.filter((l) => l.status === "new").length;
  const confirmed = all.filter((l) => l.status === "confirmed" || l.status === "completed");
  const value = confirmed.reduce((s, l) => s + l.estimatedTotal, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        hint="Every booking request sent through the site."
        actions={<a
          href="/api/admin/leads"
          className="rounded-full border border-ink/20 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-ink no-underline"
        >
          Export CSV
        </a>}
      />

      <div className="grid grid-cols-2 gap-3 wide:grid-cols-4">
        <Stat label="Total" value={String(all.length)} />
        <Stat label="Awaiting reply" value={String(openCount)} tone="terracotta" />
        <Stat label="Confirmed" value={String(confirmed.length)} tone="plum" />
        <Stat label="Confirmed value" value={inr(value)} />
      </div>

      <Panel
        title={status === "all" ? "All requests" : `Status: ${status}`}
        actions={<Picker param="status" options={STATUS_OPTIONS} current={status} />}
      >
        {rows.length === 0 ? (
          <Empty>
            {all.length === 0
              ? "No booking requests yet. Submit the form on /services to see one land here."
              : "No leads with this status."}
          </Empty>
        ) : (
          <LeadsTable leads={rows} />
        )}
      </Panel>
    </div>
  );
}
