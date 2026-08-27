import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { Badge, Empty, PageHeader, Panel } from "@/components/admin/ui";
import { ColorField, Field, FieldGroup, INPUT, SubmitRow } from "@/components/admin/form-bits";
import { saveService, setServiceActive } from "./actions";
import { duration, inr } from "@/lib/site";

export const dynamic = "force-dynamic";

const BLANK = {
  id: "",
  num: "05",
  name: "",
  suffix: null as string | null,
  price: 0,
  minutes: 60,
  body: "",
  bullets: [] as string[],
  bulletColor: "#BF5634",
  blurb: "",
  gradFrom: "#56203C",
  gradTo: "#BF5634",
  cardGradFrom: "#56203C",
  cardGradTo: "#BF5634",
  accent: "#56203C",
  category: "nails" as string,
  sortOrder: 99,
  active: true,
};

const GROUPS = [
  { key: "nails", label: "Nail services", hint: "Homepage accordion and the /services cards" },
  { key: "lashes", label: "Lash sets", hint: "Bookable lash densities" },
  { key: "lash-extra", label: "Lash lift & tint", hint: "Priced separately from mapped sets" },
] as const;

function ServiceForm({ s, isNew }: { s: typeof BLANK; isNew?: boolean }) {
  return (
    <form action={saveService} className="space-y-5">
      <FieldGroup label="Identity">
        <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
          <Field label="ID" hint={isNew ? "lowercase, no spaces" : "cannot be changed"}>
            <input
              name="id"
              defaultValue={s.id}
              readOnly={!isNew}
              required
              className={`${INPUT} ${!isNew ? "bg-ink/[0.04] text-ink/50" : ""}`}
            />
          </Field>
          <Field label="Name">
            <input name="name" defaultValue={s.name} required className={INPUT} />
          </Field>
          <Field label="Suffix" hint="e.g. (BIAB)">
            <input name="suffix" defaultValue={s.suffix ?? ""} className={INPUT} />
          </Field>
          <Field label="Category">
            <select name="category" defaultValue={s.category} className={INPUT}>
              {GROUPS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup label="Pricing & order">
        <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
          <Field label="Price (₹)">
            <input type="number" name="price" defaultValue={s.price} required className={INPUT} />
          </Field>
          <Field label="Minutes">
            <input
              type="number"
              name="minutes"
              defaultValue={s.minutes}
              required
              className={INPUT}
            />
          </Field>
          <Field label="Number" hint="Shown as 01, 02…">
            <input name="num" defaultValue={s.num} className={INPUT} />
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              name="sortOrder"
              defaultValue={s.sortOrder}
              className={INPUT}
            />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup label="Copy">
        <div className="space-y-3">
          <Field label="Card blurb" hint="Shown on the /services cards">
            <textarea name="blurb" defaultValue={s.blurb} rows={2} className={`${INPUT} py-2.5`} />
          </Field>
          <Field label="Accordion copy" hint="Shown on the homepage when opened">
            <textarea name="body" defaultValue={s.body} rows={3} className={`${INPUT} py-2.5`} />
          </Field>
          <Field label="Bullets" hint="One per line">
            <textarea
              name="bullets"
              defaultValue={s.bullets.join("\n")}
              rows={3}
              className={`${INPUT} py-2.5`}
            />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup label="Colours">
        <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-3">
          <ColorField label="Gradient from" name="gradFrom" defaultValue={s.gradFrom} />
          <ColorField label="Gradient to" name="gradTo" defaultValue={s.gradTo} />
          <ColorField label="Accent" name="accent" defaultValue={s.accent} />
          <ColorField label="Card grad from" name="cardGradFrom" defaultValue={s.cardGradFrom} />
          <ColorField label="Card grad to" name="cardGradTo" defaultValue={s.cardGradTo} />
          <ColorField label="Bullet colour" name="bulletColor" defaultValue={s.bulletColor} />
        </div>
      </FieldGroup>

      <label className="flex items-center gap-2.5 text-[13.5px] text-ink/70">
        <input type="checkbox" name="active" defaultChecked={s.active} className="h-4 w-4" />
        Show on the site
      </label>

      <SubmitRow />
    </form>
  );
}

/** Collapsed by default — twelve open forms is an unreadable page. */
function ServiceRow({ s }: { s: typeof BLANK & { active: boolean } }) {
  return (
    <details className="group border-b border-ink/[0.07] last:border-b-0 open:bg-ink/[0.012]">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ink/[0.02] [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="h-8 w-8 shrink-0 rounded-full ring-1 ring-inset ring-ink/10"
          style={{ background: `linear-gradient(135deg,${s.gradFrom},${s.gradTo})` }}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink">
            {s.name}
            {s.suffix ? <span className="text-ink/45"> {s.suffix}</span> : null}
          </span>
          <span className="block text-[11.5px] text-ink/45">
            {inr(s.price)} · {duration(s.minutes)}
          </span>
        </span>
        {!s.active && <Badge>Hidden</Badge>}
        <span className="hidden text-[11px] text-ink/35 pf:inline">{s.id}</span>
        <span
          aria-hidden
          className="shrink-0 text-ink/30 transition-transform duration-200 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="border-t border-ink/[0.07] px-5 py-5">
        <ServiceForm s={s} />
        <form
          action={async () => {
            "use server";
            await setServiceActive(s.id, !s.active);
          }}
          className="mt-3"
        >
          <button
            type="submit"
            className="cursor-pointer border-none bg-transparent p-0 text-[12px] text-ink/45 underline-offset-2 hover:text-ink hover:underline"
          >
            {s.active ? "Hide from the site" : "Show on the site"}
          </button>
        </form>
      </div>
    </details>
  );
}

export default async function ServicesAdmin() {
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        hint="Drives the homepage accordion, the /services menu and the booking form."
        actions={
          <span className="text-[12px] text-ink/45">
            {rows.filter((r) => r.active).length} of {rows.length} visible
          </span>
        }
      />

      {GROUPS.map((g) => {
        const group = rows.filter((r) => (r.category ?? "nails") === g.key);
        return (
          <Panel key={g.key} title={g.label} hint={g.hint} padded={false}>
            {group.length === 0 ? (
              <div className="p-5">
                <Empty>Nothing in this group yet.</Empty>
              </div>
            ) : (
              group.map((s) => (
                <ServiceRow
                  key={s.id}
                  s={{ ...s, bullets: s.bullets ?? [], category: s.category ?? "nails" }}
                />
              ))
            )}
          </Panel>
        );
      })}

      <Panel
        title="Add a service"
        hint="Hiding is safer than deleting — old leads keep resolving their service"
        padded={false}
      >
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-[13px] font-medium text-terracotta transition-colors hover:bg-ink/[0.02] [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            New service
          </summary>
          <div className="border-t border-ink/[0.07] px-5 py-5">
            <ServiceForm s={BLANK} isNew />
          </div>
        </details>
      </Panel>
    </div>
  );
}
