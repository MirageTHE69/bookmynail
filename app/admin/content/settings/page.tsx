import { getSettings } from "@/lib/queries";
import { Panel, PageHeader } from "@/components/admin/ui";
import { Field, INPUT, SubmitRow } from "@/components/admin/form-bits";
import { saveSettings } from "../actions";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  const s = await getSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        hint="Contact details and copy used across every page."
      />

      <Panel title="Contact">
        <form action={saveSettings} className="space-y-3">
          <div className="grid gap-3 wide:grid-cols-2">
            <Field
              label="WhatsApp number"
              hint="Country code, no + or spaces — e.g. 919825720827"
            >
              <input name="whatsapp" defaultValue={s.whatsapp} className={INPUT} />
            </Field>
            <Field label="Instagram URL">
              <input name="instagram" defaultValue={s.instagram} className={INPUT} />
            </Field>
          </div>

          <div className="grid gap-3 wide:grid-cols-2">
            <Field label="Service area" hint="Shown in the contact block. Line breaks are kept.">
              <textarea
                name="serviceArea"
                defaultValue={s.serviceArea}
                rows={3}
                className={`${INPUT} py-2`}
              />
            </Field>
            <Field label="Appointment hours" hint="Line breaks are kept.">
              <textarea name="hours" defaultValue={s.hours} rows={3} className={`${INPUT} py-2`} />
            </Field>
          </div>

          <Field
            label="Analytics retention (days)"
            hint="How long analytics events are kept before pruning."
          >
            <input
              type="number"
              name="eventRetentionDays"
              defaultValue={s.eventRetentionDays}
              className={`${INPUT} max-w-[200px]`}
            />
          </Field>

          <SubmitRow>
            <span className="text-xs text-ink/45">
              Changes appear on the public site immediately.
            </span>
          </SubmitRow>
        </form>
      </Panel>
    </div>
  );
}
