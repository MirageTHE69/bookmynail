import {
  DEVICE_SIZES,
  getClickPoints,
  getScrollFunnel,
  getSectionStats,
  getTopElements,
  getTrackedPaths,
  type DeviceKey,
  type RangeKey,
} from "@/lib/analytics";
import { Bar, Empty, Panel, TD, TH } from "@/components/admin/ui";
import Picker from "@/components/admin/range-picker";
import HeatmapCanvas from "@/components/admin/heatmap-canvas";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All" },
] as const;

const DEVICE_OPTIONS = [
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
  { value: "desktop", label: "Desktop" },
] as const;

const secs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`);

export default async function HeatmapPage({
  searchParams,
}: {
  searchParams: { path?: string; device?: string; range?: string };
}) {
  const paths = await getTrackedPaths();
  const path = searchParams.path && paths.includes(searchParams.path) ? searchParams.path : "/";
  const device = (searchParams.device ?? "desktop") as DeviceKey;
  const range = (searchParams.range ?? "30d") as RangeKey;

  const [points, sections, funnel, elements] = await Promise.all([
    getClickPoints(path, device, range),
    getSectionStats(path, range),
    getScrollFunnel(path, range),
    getTopElements(path, range),
  ]);

  const maxClicks = Math.max(1, ...sections.map((s) => s.clicks));
  const maxHovers = Math.max(1, ...sections.map((s) => s.hovers));
  const maxEl = Math.max(1, ...elements.map((e) => e.clicks));

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="m-0 font-display text-3xl text-ink">Heatmap</h1>
          <p className="m-0 mt-1 text-sm text-ink/50">
            Where attention actually lands, so you know what to improve first.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Picker
            param="path"
            label="Page"
            current={path}
            options={paths.map((p) => ({ value: p, label: p }))}
          />
          <Picker param="device" label="Device" current={device} options={DEVICE_OPTIONS} />
          <Picker param="range" label="Range" current={range} options={RANGE_OPTIONS} />
        </div>
      </header>

      <Panel
        title={`Click map · ${path}`}
        hint={`${points.length.toLocaleString("en-IN")} clicks on ${device} (${DEVICE_SIZES[device].w}px)`}
        actions={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-ink/45">
            <span>Cool</span>
            <span
              className="h-2 w-24 rounded-full"
              style={{
                background: "linear-gradient(90deg,#43305E,#B4A2D4,#E7A79F,#BF5634)",
              }}
            />
            <span>Hot</span>
          </div>
        }
      >
        {points.length === 0 ? (
          <Empty>
            No clicks recorded for {path} on {device} in this range. Browse the site at that
            width, then come back.
          </Empty>
        ) : (
          <HeatmapCanvas
            path={path}
            width={DEVICE_SIZES[device].w}
            height={DEVICE_SIZES[device].h}
            points={points}
          />
        )}
      </Panel>

      <div className="grid gap-6 wide:grid-cols-2">
        <Panel title="Sections" hint="Clicks, hover interest and time in view">
          {sections.length === 0 ? (
            <Empty>No section data yet.</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr>
                    <th className={TH}>Section</th>
                    <th className={TH}>Clicks</th>
                    <th className={TH}>Hovers</th>
                    <th className={TH}>Avg dwell</th>
                    <th className={TH}>Reach</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => (
                    <tr key={s.section}>
                      <td className={`${TD} font-display`}>{s.section}</td>
                      <td className={`${TD} w-[34%]`}>
                        <Bar value={s.clicks} max={maxClicks} />
                      </td>
                      <td className={`${TD} w-[26%]`}>
                        <Bar value={s.hovers} max={maxHovers} color="#B4A2D4" />
                      </td>
                      <td className={TD}>{s.dwellMs ? secs(s.dwellMs) : "—"}</td>
                      <td className={TD}>{s.reach}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Scroll depth" hint="Share of sessions reaching each point">
            <div className="space-y-3">
              {funnel.map((f) => (
                <div key={f.depth}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-display text-sm text-ink">{f.depth}%</span>
                    <span className="text-xs text-ink/45">{f.pct}% of sessions</span>
                  </div>
                  <Bar value={f.sessions} max={Math.max(1, funnel[0]?.sessions ?? 1)} color="#56203C" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Most clicked" hint="Ranked by clicks in range">
            {elements.length === 0 ? (
              <Empty>Nothing clicked yet.</Empty>
            ) : (
              <div className="space-y-2.5">
                {elements.map((e) => (
                  <div key={e.label}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm text-ink/80" title={e.label}>
                        {e.label}
                      </span>
                      <span className="shrink-0 text-[11px] uppercase tracking-wide text-ink/40">
                        {e.section}
                      </span>
                    </div>
                    <Bar value={e.clicks} max={maxEl} color="#8E3A1F" />
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
