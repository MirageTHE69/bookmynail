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
};

const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-terracotta/10 text-terracotta ring-terracotta/25",
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
              <th className={TH}>Total</th>
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
                <td className={TD}>{inr(l.estimatedTotal)}</td>
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
