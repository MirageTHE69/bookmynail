import Image from "next/image";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { portfolioItems } from "@/lib/db/schema";
import { Empty, Panel, PageHeader } from "@/components/admin/ui";
import { Field, INPUT, SubmitRow } from "@/components/admin/form-bits";
import { createPortfolioItem, deletePortfolioItem, updatePortfolioItem } from "../actions";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Manicure", "Nail Art", "Extensions", "Bridal"];

export default async function PortfolioAdmin() {
  const rows = await db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        hint="The /portfolio grid. Category tabs and the “sets shown” count both follow this list — add an Extensions or Bridal set and those tabs reappear on their own."
      />

      <Panel title="Upload a set">
        <form action={createPortfolioItem} className="space-y-3">
          <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
            <Field label="Image" hint="WebP, JPEG, PNG or AVIF · max 8MB">
              <input
                type="file"
                name="image"
                accept="image/webp,image/jpeg,image/png,image/avif"
                required
                className="w-full text-sm text-ink/70 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.14em] file:text-bone"
              />
            </Field>
            <Field label="Category">
              <select name="category" className={INPUT} defaultValue="Nail Art">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Tile height" hint="Tall tiles span two grid rows">
              <select name="span" className={INPUT} defaultValue="1">
                <option value="1">Standard</option>
                <option value="2">Tall</option>
              </select>
            </Field>
            <Field label="Order">
              <input type="number" name="sortOrder" defaultValue={rows.length} className={INPUT} />
            </Field>
          </div>
          <SubmitRow />
        </form>
      </Panel>

      <Panel title={`Current sets (${rows.length})`}>
        {rows.length === 0 ? (
          <Empty>No portfolio items yet.</Empty>
        ) : (
          <div className="grid gap-4 pf:grid-cols-2 wide:grid-cols-3">
            {rows.map((p) => (
              <div key={p.id} className="rounded-lg border border-ink/10 p-3">
                <div className="relative mb-3 h-44 overflow-hidden rounded-md bg-ink/5">
                  <Image
                    src={p.imageUrl}
                    alt={`${p.category} set`}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  {!p.active && (
                    <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-bone">
                      Hidden
                    </span>
                  )}
                </div>

                <form action={updatePortfolioItem} className="space-y-2">
                  <input type="hidden" name="id" value={p.id} />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Category">
                      <select name="category" defaultValue={p.category} className={INPUT}>
                        {Array.from(new Set([...CATEGORIES, p.category])).map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Height">
                      <select name="span" defaultValue={String(p.span)} className={INPUT}>
                        <option value="1">Standard</option>
                        <option value="2">Tall</option>
                      </select>
                    </Field>
                    <Field label="Order">
                      <input
                        type="number"
                        name="sortOrder"
                        defaultValue={p.sortOrder}
                        className={INPUT}
                      />
                    </Field>
                    <Field label="Visible">
                      <label className="flex min-h-[42px] items-center gap-2 text-sm text-ink/70">
                        <input type="checkbox" name="active" defaultChecked={p.active} />
                        Show
                      </label>
                    </Field>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="min-h-[38px] flex-1 cursor-pointer rounded-full border-none bg-ink text-[11px] uppercase tracking-[0.14em] text-bone"
                    >
                      Save
                    </button>
                  </div>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await deletePortfolioItem(p.id);
                  }}
                  className="mt-2"
                >
                  <button
                    type="submit"
                    className="min-h-[38px] w-full cursor-pointer rounded-full border border-terracotta bg-transparent text-[11px] uppercase tracking-[0.14em] text-terracotta"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
