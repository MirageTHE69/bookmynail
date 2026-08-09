import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { Panel } from "@/components/admin/ui";
import { ColorField, Field, INPUT, SubmitRow } from "@/components/admin/form-bits";
import { saveService, setServiceActive } from "./actions";
import { inr } from "@/lib/site";

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
  sortOrder: 99,
  active: true,
};

function ServiceForm({ s, isNew }: { s: typeof BLANK; isNew?: boolean }) {
  return (
    <form action={saveService} className="space-y-3">
      <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
        <Field label="ID" hint={isNew ? "lowercase, no spaces" : "cannot be changed"}>
          <input
            name="id"
            defaultValue={s.id}
            readOnly={!isNew}
            required
            className={`${INPUT} ${!isNew ? "bg-ink/[0.04] text-ink/60" : ""}`}
          />
        </Field>
        <Field label="Number">
          <input name="num" defaultValue={s.num} className={INPUT} />
        </Field>
        <Field label="Name">
          <input name="name" defaultValue={s.name} required className={INPUT} />
        </Field>
        <Field label="Suffix" hint="e.g. (BIAB)">
          <input name="suffix" defaultValue={s.suffix ?? ""} className={INPUT} />
        </Field>
      </div>

      <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-4">
        <Field label="Price (₹)">
          <input type="number" name="price" defaultValue={s.price} required className={INPUT} />
        </Field>
        <Field label="Minutes">
          <input type="number" name="minutes" defaultValue={s.minutes} required className={INPUT} />
        </Field>
        <Field label="Sort order">
          <input type="number" name="sortOrder" defaultValue={s.sortOrder} className={INPUT} />
        </Field>
        <Field label="Visible">
          <label className="flex min-h-[42px] items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="active" defaultChecked={s.active} />
            Show on the site
          </label>
        </Field>
      </div>

      <Field label="Card blurb" hint="Shown on the /services cards">
        <textarea name="blurb" defaultValue={s.blurb} rows={2} className={`${INPUT} py-2`} />
      </Field>

      <Field label="Accordion copy" hint="Shown on the homepage when opened">
        <textarea name="body" defaultValue={s.body} rows={3} className={`${INPUT} py-2`} />
      </Field>

      <Field label="Bullets" hint="One per line">
        <textarea
          name="bullets"
          defaultValue={s.bullets.join("\n")}
          rows={3}
          className={`${INPUT} py-2`}
        />
      </Field>

      <div className="grid gap-3 pf:grid-cols-2 wide:grid-cols-3">
        <ColorField label="Gradient from" name="gradFrom" defaultValue={s.gradFrom} />
        <ColorField label="Gradient to" name="gradTo" defaultValue={s.gradTo} />
        <ColorField label="Accent" name="accent" defaultValue={s.accent} />
        <ColorField label="Card grad from" name="cardGradFrom" defaultValue={s.cardGradFrom} />
        <ColorField label="Card grad to" name="cardGradTo" defaultValue={s.cardGradTo} />
        <ColorField label="Bullet colour" name="bulletColor" defaultValue={s.bulletColor} />
      </div>

      <SubmitRow>
        {!isNew && (
          <span className="text-xs text-ink/45">
            Preview:{" "}
            <span
              className="ml-1 inline-block h-3 w-16 rounded-full align-middle"
              style={{ background: `linear-gradient(135deg,${s.gradFrom},${s.gradTo})` }}
            />
          </span>
        )}
      </SubmitRow>
    </form>
  );
}

export default async function ServicesAdmin() {
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="m-0 font-display text-3xl text-ink">Services</h1>
        <p className="m-0 mt-1 text-sm text-ink/50">
          Drives the homepage accordion, the /services cards and the booking form.
        </p>
      </header>

      {rows.map((s) => (
        <Panel
          key={s.id}
          title={`${s.name}${s.suffix ? ` ${s.suffix}` : ""}`}
          hint={`${inr(s.price)} · ${s.minutes} min${s.active ? "" : " · hidden"}`}
          actions={
            <form
              action={async () => {
                "use server";
                await setServiceActive(s.id, !s.active);
              }}
            >
              <button
                type="submit"
                className="cursor-pointer rounded-full border border-ink/20 bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-ink"
              >
                {s.active ? "Hide" : "Show"}
              </button>
            </form>
          }
        >
          <ServiceForm s={{ ...s, bullets: s.bullets ?? [] }} />
        </Panel>
      ))}

      <Panel title="Add a service" hint="Hiding is safer than deleting — old leads keep resolving">
        <ServiceForm s={BLANK} isNew />
      </Panel>
    </div>
  );
}
