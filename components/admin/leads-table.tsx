"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/db/schema";
import { TD, TH } from "@/components/admin/ui";
import { inr } from "@/lib/site";

export type LeadRow = {
  id: number;
  createdAt: number;
  name: string;
  phone: string;
  email: string | null;
  area: string | null;
  address: string;
  notes: string | null;
  serviceName: string;
  addons: { id: string; label: string; price: number }[];
  people: number;
  preferredDate: string | null;
  preferredTime: string | null;
  estimatedTotal: number;
  discount: number;
  status: LeadStatus;
  adminNotes: string | null;
  depositAmount: number | null;
  screenshotUrl: string | null;
  paymentRef: string | null;
  paidAt: number | null;
};

const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-terracotta/10 text-terracotta ring-terracotta/25",
  awaiting_payment: "bg-amber-500/10 text-amber-700 ring-amber-500/25",
  payment_submitted: "bg-blue-600/10 text-blue-700 ring-blue-600/25",
  contacted: "bg-plum/10 text-plum ring-plum/25",
  confirmed: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/25",
  completed: "bg-ink/[0.06] text-ink/60 ring-ink/15",
  cancelled: "bg-ink/[0.04] text-ink/35 ring-ink/10",
};

export default function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState("");

  const patch = async (id: number, body: Record<string, unknown>) => {
    setBusy(true);
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    setBusy(false);
    router.refresh();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this lead permanently? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    setBusy(false);
    setOpen(null);
    router.refresh();
  };

  const current = leads.find((l) => l.id === open) ?? null;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr>
              <th className={TH}>When</th>
              <th className={TH}>Name</th>
              <th className={TH}>Phone</th>
              <th className={TH}>Service</th>
              <th className={TH}>Slot</th>
              <th className={`${TH} text-right`}>Total</th>
              <th className={TH}>Deposit</th>
              <th className={TH}>Status</th>
              <th className={TH} />
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-ink/[0.02]">
                <td className={TD}>
                  {new Date(l.createdAt * 1000).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className={`${TD} whitespace-nowrap text-ink/55`}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(l.id);
                      setNotes(l.adminNotes ?? "");
                    }}
                    className="cursor-pointer border-none bg-transparent p-0 text-left text-[13.5px] font-medium text-ink hover:text-terracotta"
                  >
                    {l.name}
                  </button>
                </td>
                <td className={TD}>
                  <a href={`tel:${l.phone}`} className="text-ink/70 no-underline hover:text-ink">
                    {l.phone}
                  </a>
                </td>
                <td className={TD}>
                  {l.serviceName}
                  {l.people > 1 && <span className="text-ink/45"> × {l.people}</span>}
                </td>
                <td className={TD}>
                  {l.preferredDate ?? "—"}
                  {l.preferredTime ? ` · ${l.preferredTime}` : ""}
                </td>
                <td className={`${TD} text-right tabular-nums`}>{inr(l.estimatedTotal)}</td>
                <td className={TD}>
                  {l.depositAmount ? (
                    <span className="flex items-center gap-2">
                      {l.screenshotUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={l.screenshotUrl}
                          alt="Payment screenshot"
                          className="h-8 w-8 shrink-0 rounded object-cover ring-1 ring-ink/10"
                        />
                      ) : (
                        <span className="h-8 w-8 shrink-0 rounded bg-ink/[0.05] ring-1 ring-ink/10" />
                      )}
                      <span className="whitespace-nowrap text-[12.5px] tabular-nums text-ink/70">
                        {inr(l.depositAmount)}
                        {l.paidAt && <span className="text-emerald-700"> ✓</span>}
                      </span>
                    </span>
                  ) : (
                    <span className="text-ink/30">—</span>
                  )}
                </td>
                <td className={TD}>
                  <select
                    value={l.status}
                    disabled={busy}
                    onChange={(e) => patch(l.id, { status: e.target.value })}
                    className={`cursor-pointer appearance-none rounded-full border-none bg-none px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] ring-1 ring-inset transition-colors ${STATUS_TONE[l.status]}`}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-white text-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={TD}>
                  <a
                    href={`https://wa.me/${l.phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(?!91)/, "91")}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-[12.5px] font-medium text-terracotta no-underline hover:underline"
                  >
                    WhatsApp ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40"
          onClick={() => setOpen(null)}
        >
          <div
            className="h-full w-full max-w-[460px] overflow-y-auto bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="m-0 font-display text-2xl text-ink">{current.name}</h2>
                <p className="m-0 mt-1 text-xs text-ink/50">
                  {new Date(current.createdAt * 1000).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="cursor-pointer border-none bg-transparent text-xl text-ink/50"
              >
                ×
              </button>
            </div>

            <dl className="m-0 space-y-3 text-sm">
              {[
                ["Phone", current.phone],
                ["Email", current.email || "—"],
                ["Area", current.area || "—"],
                ["Address", current.address],
                ["Service", `${current.serviceName} × ${current.people}`],
                [
                  "Add-ons",
                  current.addons.length ? current.addons.map((a) => a.label).join(", ") : "None",
                ],
                [
                  "Slot",
                  `${current.preferredDate ?? "—"}${current.preferredTime ? ` · ${current.preferredTime}` : ""}`,
                ],
                [
                  "Total",
                  `${inr(current.estimatedTotal)}${current.discount ? ` (−${inr(current.discount)} group)` : ""}`,
                ],
                ["Their notes", current.notes || "—"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-ink/45">{k}</dt>
                  <dd className="m-0 whitespace-pre-wrap text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>

            <label className="mt-6 block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-ink/45">
                Internal notes
              </span>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Called, quoted, follow up Friday…"
                className="w-full resize-y rounded-md border border-ink/20 p-3 text-sm"
              />
            </label>

            {current.depositAmount ? (
                <div className="mb-5 rounded-lg border border-ink/[0.09] bg-ink/[0.015] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="m-0 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/45">
                      Deposit
                    </p>
                    <p className="m-0 text-[15px] font-medium tabular-nums text-ink">
                      {inr(current.depositAmount)}
                      <span className="text-ink/45"> of {inr(current.estimatedTotal)}</span>
                    </p>
                  </div>

                  {current.paymentRef && (
                    <p className="m-0 mt-1.5 text-[12px] text-ink/55">
                      UPI ref: <span className="tabular-nums">{current.paymentRef}</span>
                    </p>
                  )}

                  {current.screenshotUrl ? (
                    <a
                      href={current.screenshotUrl}
                      target="_blank"
                      rel="noopener"
                      className="mt-3 block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={current.screenshotUrl}
                        alt="Customer payment screenshot"
                        className="max-h-64 w-auto rounded-lg ring-1 ring-ink/10"
                      />
                      <span className="mt-1 block text-[11.5px] text-ink/45">
                        Open full size ↗
                      </span>
                    </a>
                  ) : (
                    <p className="m-0 mt-2 text-[12px] text-ink/45">
                      No screenshot uploaded yet.
                    </p>
                  )}

                  {current.paidAt ? (
                    <p className="m-0 mt-3 text-[12.5px] font-medium text-emerald-700">
                      Payment confirmed{" "}
                      {new Date(current.paidAt * 1000).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => patch(current.id, { markPaid: true })}
                        className="mt-3 inline-flex min-h-[38px] cursor-pointer items-center rounded-lg border-none bg-emerald-700 px-5 text-[12px] font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
                      >
                        Payment received
                      </button>
                      <p className="m-0 mt-2 text-[11.5px] leading-[1.5] text-ink/45">
                        Check the amount landed in GPay before confirming — a screenshot on its
                        own is not proof.
                      </p>
                    </>
                  )}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => patch(current.id, { adminNotes: notes })}
                className="inline-flex min-h-[38px] cursor-pointer items-center rounded-lg border-none bg-ink px-5 text-[12px] font-medium text-white transition-colors hover:bg-ink/85 disabled:opacity-50"
              >
                Save notes
              </button>
              <a
                href={`https://wa.me/${current.phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(?!91)/, "91")}`}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-[38px] items-center rounded-lg border border-ink/15 bg-white px-5 text-[12px] font-medium text-ink/75 no-underline transition-colors hover:border-ink/30 hover:text-ink"
              >
                WhatsApp
              </a>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(current.id)}
                className="ml-auto inline-flex min-h-[38px] cursor-pointer items-center rounded-lg border border-red-200 bg-white px-5 text-[12px] font-medium text-red-600 transition-colors hover:border-red-400 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
