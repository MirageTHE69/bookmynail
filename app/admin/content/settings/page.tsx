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

      <Panel
        title="Deposit payment"
        hint="Customers pay a deposit by UPI, then upload a screenshot you confirm on the Leads page."
      >
        <form action={saveSettings} className="space-y-3">
          <div className="grid gap-3 wide:grid-cols-2">
            <Field
              label="UPI ID"
              hint="e.g. bookmynail@okhdfcbank. Leave blank to turn payments off — bookings then fall back to WhatsApp."
            >
              <input
                name="upiId"
                defaultValue={s.upiId}
                placeholder="name@bank"
                className={INPUT}
              />
            </Field>
            <Field label="Name shown in the payment app">
              <input name="upiName" defaultValue={s.upiName} className={INPUT} />
            </Field>
          </div>

          <div className="grid gap-3 wide:grid-cols-2">
            <Field label="Deposit type">
              <select name="depositType" defaultValue={s.depositType} className={INPUT}>
                <option value="fixed">Fixed amount (₹)</option>
                <option value="percent">Percentage of total</option>
              </select>
            </Field>
            <Field
              label="Deposit value"
              hint="₹500, or 20 for 20%. Never charged above the booking total."
            >
              <input
                type="number"
                name="depositValue"
                defaultValue={s.depositValue}
                className={INPUT}
              />
            </Field>
          </div>

          <SubmitRow>
            <span className="text-xs text-ink/45">
              A screenshot is not proof of payment — always check GPay before confirming.
            </span>
          </SubmitRow>
        </form>
      </Panel>
    </div>
  );
}
