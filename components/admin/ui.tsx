import type { ReactNode } from "react";

/**
 * Shared admin primitives.
 *
 * Brand palette, but a tool rather than a shop window: Bodoni is reserved for
 * page titles and headline figures, everything else — and all tabular data —
 * is Archivo, which stays legible at small sizes and lines up numerically.
 */

/* ── Page furniture ────────────────────────────────────────────────── */

export function PageHeader({
  title,
  hint,
  actions,
}: {
  title: string;
  hint?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="m-0 font-display text-[30px] leading-tight tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {hint && <p className="m-0 mt-1 text-[13px] text-ink/55">{hint}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  hint,
  actions,
  children,
  padded = true,
  className = "",
}: {
  title?: string;
  hint?: string;
  actions?: ReactNode;
  children: ReactNode;
  /** Tables set this false so rows can run edge to edge. */
  padded?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-ink/[0.09] bg-white shadow-[0_1px_2px_rgba(26,22,20,0.04)] ${className}`}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.08] bg-ink/[0.015] px-5 py-3.5">
          <div>
            {title && (
              <h2 className="m-0 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink/80">
                {title}
              </h2>
            )}
            {hint && <p className="m-0 mt-0.5 text-xs text-ink/45">{hint}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

/* ── Data display ──────────────────────────────────────────────────── */

const TONES = {
  ink: "text-ink",
  terracotta: "text-terracotta",
  plum: "text-plum",
  chrome: "text-ink/45",
} as const;

export function Stat({
  label,
  value,
  sub,
  tone = "ink",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="flex min-h-[104px] flex-col justify-between rounded-xl border border-ink/[0.09] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(26,22,20,0.04)]">
      <p className="m-0 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/45">
        {label}
      </p>
      <div>
        <p className={`m-0 font-display text-[32px] leading-none ${TONES[tone]}`}>{value}</p>
        {/* Reserved even when empty so a row of cards keeps one baseline. */}
        <p className="m-0 mt-1.5 min-h-[16px] text-[11.5px] leading-none text-ink/45">
          {sub ?? ""}
        </p>
      </div>
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
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"
        role="img"
        aria-label={label ?? `${value} of ${max}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-[13px] font-medium tabular-nums text-ink/70">
        {value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

const BADGES: Record<string, string> = {
  new: "bg-terracotta/10 text-terracotta ring-terracotta/20",
  contacted: "bg-plum/10 text-plum ring-plum/20",
  confirmed: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
  completed: "bg-ink/[0.06] text-ink/60 ring-ink/10",
  cancelled: "bg-ink/[0.04] text-ink/35 ring-ink/[0.08]",
  nails: "bg-terracotta/10 text-terracotta ring-terracotta/20",
  lashes: "bg-plum/10 text-plum ring-plum/20",
  "lash-extra": "bg-ink/[0.06] text-ink/60 ring-ink/10",
};

export function Badge({ tone, children }: { tone?: string; children: ReactNode }) {
  const cls = (tone && BADGES[tone]) ?? "bg-ink/[0.06] text-ink/60 ring-ink/10";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] ring-1 ring-inset ${cls}`}
    >
      {children}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 px-4 py-10 text-center">
      <p className="m-0 text-sm text-ink/45">{children}</p>
    </div>
  );
}

/* ── Controls ──────────────────────────────────────────────────────── */

export const BTN =
  "inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-4 text-[12px] font-medium tracking-[0.02em] no-underline transition-colors";
export const BTN_PRIMARY = `${BTN} border-ink bg-ink text-white hover:bg-ink/85`;
export const BTN_GHOST = `${BTN} border-ink/15 bg-white text-ink/75 hover:border-ink/30 hover:text-ink`;
export const BTN_DANGER = `${BTN} border-red-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50`;

export const TH =
  "px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-ink/40";
export const TD = "px-4 py-3 text-[13.5px] text-ink/80 border-t border-ink/[0.07]";
