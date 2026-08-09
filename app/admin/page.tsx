import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getOverview, getServiceStats, type RangeKey } from "@/lib/analytics";
import { Bar, Empty, Panel, Stat, TD, TH } from "@/components/admin/ui";
import Picker from "@/components/admin/range-picker";
import { inr } from "@/lib/site";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All" },
] as const;

export default async function AdminOverview({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = (searchParams.range ?? "30d") as RangeKey;

  const [stats, services, recent] = await Promise.all([
    getOverview(range),
    getServiceStats(range),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
  ]);

  const maxPage = Math.max(1, ...stats.pages.map((p) => p.views));
  const maxSvc = Math.max(1, ...services.map((s) => s.interactions));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 font-display text-3xl text-ink">Overview</h1>
          <p className="m-0 mt-1 text-sm text-ink/50">
            Traffic, engagement and booking requests.
          </p>
        </div>
        <Picker param="range" options={RANGE_OPTIONS} current={range} label="Range" />
      </header>

      <div className="grid grid-cols-2 gap-3 pf:grid-cols-3 wide:grid-cols-6">
        <Stat label="Sessions" value={stats.sessions.toLocaleString("en-IN")} />
        <Stat label="Visitors" value={stats.visitors.toLocaleString("en-IN")} />
        <Stat label="Page views" value={stats.pageviews.toLocaleString("en-IN")} />
        <Stat label="Clicks" value={stats.clicks.toLocaleString("en-IN")} />
        <Stat label="Leads" value={stats.leads.toLocaleString("en-IN")} tone="terracotta" />
        <Stat
          label="Conversion"
          value={`${stats.conversion.toFixed(1)}%`}
          sub={stats.leadValue ? `${inr(stats.leadValue)} requested` : undefined}
          tone="plum"
        />
      </div>

      <div className="grid gap-6 wide:grid-cols-2">
        <Panel title="Pages" hint="Views and clicks per route">
          {stats.pages.length === 0 ? (
            <Empty>No traffic recorded yet — browse the site and it will appear here.</Empty>
          ) : (
            <div className="space-y-3">
              {stats.pages.map((p) => (
                <div key={p.path}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <Link
                      href={`/admin/heatmap?path=${encodeURIComponent(p.path)}&range=${range}`}
                      className="font-display text-sm text-ink no-underline hover:text-terracotta"
                    >
                      {p.path}
                    </Link>
                    <span className="text-xs text-ink/45">
                      {p.sessions} sessions · {p.clicks} clicks
                    </span>
                  </div>
                  <Bar value={p.views} max={maxPage} label={`${p.path}: ${p.views} views`} />
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Services" hint="Opens vs booking requests">
          {services.length === 0 ? (
            <Empty>No service interactions yet.</Empty>
          ) : (
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-display text-sm text-ink">{s.id}</span>
                    <span className="text-xs text-ink/45">
                      {s.leads} lead{s.leads === 1 ? "" : "s"}
                      {s.value ? ` · ${inr(s.value)}` : ""}
                    </span>
                  </div>
                  <Bar value={s.interactions} max={maxSvc} color="#56203C" />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="Latest requests"
        actions={
          <Link
            href="/admin/leads"
            className="text-[11px] uppercase tracking-[0.14em] text-terracotta no-underline"
          >
            All leads →
          </Link>
        }
      >
        {recent.length === 0 ? (
          <Empty>No booking requests yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className={TH}>When</th>
                  <th className={TH}>Name</th>
                  <th className={TH}>Service</th>
                  <th className={TH}>Total</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((l) => (
                  <tr key={l.id}>
                    <td className={TD}>
                      {new Date(l.createdAt * 1000).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className={TD}>
                      <Link
                        href={`/admin/leads?id=${l.id}`}
                        className="text-ink no-underline hover:text-terracotta"
                      >
                        {l.name}
                      </Link>
                    </td>
                    <td className={TD}>{l.serviceName}</td>
                    <td className={TD}>{inr(l.estimatedTotal)}</td>
                    <td className={TD}>
                      <span className="rounded-full bg-ink/[0.06] px-2 py-0.5 text-[11px] uppercase tracking-wide">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
