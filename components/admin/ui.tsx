import type { ReactNode } from "react";

/**
 * Shared admin primitives. Brand tokens, but denser and more utilitarian than
 * the marketing site — this is a tool, not a shop window.
 */

export function Panel({
  title,
  hint,
  actions,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-ink/10 bg-white ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-3.5">
          <div>
            {title && <h2 className="m-0 font-display text-lg text-ink">{title}</h2>}
            {hint && <p className="m-0 mt-0.5 text-xs text-ink/50">{hint}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "ink",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ink" | "terracotta" | "plum";
}) {
  const color =
    tone === "terracotta" ? "text-terracotta" : tone === "plum" ? "text-plum" : "text-ink";
  return (
    <div className="rounded-lg border border-ink/10 bg-white px-5 py-4">
      <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className={`m-0 mt-1.5 font-display text-3xl leading-none ${color}`}>{value}</p>
      {sub && <p className="m-0 mt-1.5 text-xs text-ink/50">{sub}</p>}
    </div>
  );
}

/**
 * Horizontal magnitude bar. A shared max across a group keeps every row on the
 * same scale, so lengths are comparable at a glance.
 */
export function Bar({
  value,
  max,
  color = "#BF5634",
  label,
}: {
  value: number;
  max: number;
  color?: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"
        role="img"
        aria-label={label ?? `${value} of ${max}`}
      >
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-14 shrink-0 text-right font-display text-sm tabular-nums text-ink">
        {value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 rounded-md border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink/50">
      {children}
    </p>
  );
}

export const TH = "px-3 py-2 text-left text-[10px] uppercase tracking-[0.16em] text-ink/45 font-normal";
export const TD = "px-3 py-2.5 text-sm text-ink/80 border-t border-ink/[0.07]";
