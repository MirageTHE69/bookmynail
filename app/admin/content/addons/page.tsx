import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { addons } from "@/lib/db/schema";
import { Badge, Empty, PageHeader, Panel } from "@/components/admin/ui";
import { Field, INPUT, SubmitRow } from "@/components/admin/form-bits";
import { saveAddon } from "../actions";
import { inr } from "@/lib/site";

export const dynamic = "force-dynamic";

const SCOPES = [
  { key: "nails", label: "Nail add-ons", hint: "Offered with the four nail services" },
  { key: "lashes", label: "Lash add-ons", hint: "Offered with lash sets and lift/tint" },
] as const;

export default async function AddonsAdmin() {
  const rows = await db.select().from(addons).orderBy(asc(addons.sortOrder));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add-ons"
        hint="Shown as chips on the site and priced into the booking form total."
        actions={
          <span className="text-[12px] text-ink/45">
            {rows.filter((r) => r.active).length} of {rows.length} visible
          </span>
        }
      />

      {SCOPES.map((scope) => {
        const group = rows.filter((r) => (r.on ?? "nails") === scope.key);
        return (
          <Panel key={scope.key} title={scope.label} hint={scope.hint} padded={false}>
            {group.length === 0 ? (
              <div className="p-5">
                <Empty>Nothing in this group yet.</Empty>
              </div>
            ) : (
              group.map((a) => (
                <details
                  key={a.id}
                  className="group border-b border-ink/[0.07] last:border-b-0 open:bg-ink/[0.012]"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ink/[0.02] [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-ink">
                        {a.label}
                      </span>
                      <span className="block text-[11.5px] text-ink/45">{inr(a.price)}</span>
                    </span>
                    {!a.active && <Badge>Hidden</Badge>}
                    <span className="hidden text-[11px] text-ink/35 pf:inline">{a.id}</span>
                    <span
                      aria-hidden
                      className="shrink-0 text-ink/30 transition-transform duration-200 group-open:rotate-180"
                    >
                      ▾
                    </span>
                  </summary>

                  <div className="border-t border-ink/[0.07] px-5 py-5">
                    <form action={saveAddon} className="space-y-4">
                      <input type="hidden" name="id" value={a.id} />
                      <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
                        <Field label="Label">
                          <input name="label" defaultValue={a.label} className={INPUT} />
                        </Field>
                        <Field label="Price (₹)">
                          <input
                            type="number"
                            name="price"
                            defaultValue={a.price}
                            className={INPUT}
                          />
                        </Field>
                        <Field label="Menu" hint="Which services offer it">
                          <select name="on" defaultValue={a.on ?? "nails"} className={INPUT}>
                            <option value="nails">Nails</option>
                            <option value="lashes">Lashes</option>
                          </select>
                        </Field>
                        <Field label="Order">
                          <input
                            type="number"
                            name="sortOrder"
                            defaultValue={a.sortOrder}
                            className={INPUT}
                          />
                        </Field>
                      </div>
                      <label className="flex items-center gap-2.5 text-[13.5px] text-ink/70">
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={a.active}
                          className="h-4 w-4"
                        />
                        Show on the site
                      </label>
                      <SubmitRow />
                    </form>
                  </div>
                </details>
              ))
            )}
          </Panel>
        );
      })}

      <Panel title="Add an add-on" padded={false}>
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-[13px] font-medium text-terracotta transition-colors hover:bg-ink/[0.02] [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            New add-on
          </summary>
          <div className="border-t border-ink/[0.07] px-5 py-5">
            <form action={saveAddon}>
              <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-5">
                <Field label="ID" hint="lowercase, no spaces">
                  <input name="id" required className={INPUT} />
                </Field>
                <Field label="Label">
                  <input name="label" required className={INPUT} />
                </Field>
                <Field label="Price (₹)">
                  <input type="number" name="price" required className={INPUT} />
                </Field>
                <Field label="Menu">
                  <select name="on" defaultValue="nails" className={INPUT}>
                    <option value="nails">Nails</option>
                    <option value="lashes">Lashes</option>
                  </select>
                </Field>
                <Field label="Order">
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={rows.length}
                    className={INPUT}
                  />
                </Field>
              </div>
              <input type="hidden" name="active" value="true" />
              <SubmitRow />
            </form>
          </div>
        </details>
      </Panel>
    </div>
  );
}
