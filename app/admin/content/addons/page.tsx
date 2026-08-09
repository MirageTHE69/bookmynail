import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { addons } from "@/lib/db/schema";
import { Panel } from "@/components/admin/ui";
import { Field, INPUT, SubmitRow } from "@/components/admin/form-bits";
import { saveAddon, setAddonActive } from "../actions";

export const dynamic = "force-dynamic";

export default async function AddonsAdmin() {
  const rows = await db.select().from(addons).orderBy(asc(addons.sortOrder));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="m-0 font-display text-3xl text-ink">Add-ons</h1>
        <p className="m-0 mt-1 text-sm text-ink/50">
          Shown as chips on the homepage and priced into the booking form total.
        </p>
      </header>

      <Panel title="Current add-ons">
        <div className="space-y-3">
          {rows.map((a) => (
            <form
              key={a.id}
              action={saveAddon}
              className="grid items-end gap-3 border-b border-ink/[0.07] pb-3 pf:grid-cols-2 wide:grid-cols-[1fr_1fr_120px_100px_auto_auto]"
            >
              <input type="hidden" name="id" value={a.id} />
              <Field label="Label">
                <input name="label" defaultValue={a.label} className={INPUT} />
              </Field>
              <Field label="Price (₹)">
                <input type="number" name="price" defaultValue={a.price} className={INPUT} />
              </Field>
              <Field label="Order">
                <input type="number" name="sortOrder" defaultValue={a.sortOrder} className={INPUT} />
              </Field>
              <Field label="Visible">
                <label className="flex min-h-[42px] items-center gap-2 text-sm text-ink/70">
                  <input type="checkbox" name="active" defaultChecked={a.active} />
                  Show
                </label>
              </Field>
              <button
                type="submit"
                className="min-h-[42px] cursor-pointer rounded-full border-none bg-ink px-5 text-[11px] uppercase tracking-[0.14em] text-bone"
              >
                Save
              </button>
              <span className="text-xs text-ink/40">{a.id}</span>
            </form>
          ))}
        </div>
      </Panel>

      <Panel title="Add an add-on">
        <form action={saveAddon}>
          <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
            <Field label="ID" hint="lowercase, no spaces">
              <input name="id" required className={INPUT} />
            </Field>
            <Field label="Label">
              <input name="label" required className={INPUT} />
            </Field>
            <Field label="Price (₹)">
              <input type="number" name="price" required className={INPUT} />
            </Field>
            <Field label="Order">
              <input type="number" name="sortOrder" defaultValue={rows.length} className={INPUT} />
            </Field>
          </div>
          <input type="hidden" name="active" value="true" />
          <SubmitRow />
        </form>
      </Panel>
    </div>
  );
}
