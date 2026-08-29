import type { SiteSettings } from "@/lib/queries";

/**
 * Deposit payment by UPI.
 *
 * There is no payment gateway. The customer pays a deposit into the studio's
 * UPI id and uploads a screenshot; the owner confirms it against her own GPay
 * app. Nothing here decides that a payment succeeded — a screenshot cannot
 * prove that, so confirmation is deliberately a human step in the admin panel.
 */

/**
 * What to ask for up front.
 *
 * Clamped to the booking total: a flat ₹500 deposit must not exceed a ₹499
 * service (Extension removal), which would ask the customer to overpay.
 */
export function depositFor(total: number, settings: Partial<SiteSettings>): number {
  const value = Number(settings.depositValue ?? 0);
  if (!Number.isFinite(value) || value <= 0) return 0;

  const raw =
    settings.depositType === "percent" ? Math.round((total * value) / 100) : Math.round(value);

  return Math.max(0, Math.min(raw, total));
}

/**
 * A UPI intent link. On a phone this opens GPay / PhonePe / Paytm with the
 * amount and reference already filled — which beats a QR code, because you
 * cannot scan a QR with the same phone that is displaying it.
 *
 * The reference rides in `tn`, so the owner's payment history reads
 * "BMN-481920" and reconciling a booking is a glance rather than a hunt.
 */
export function upiLink(opts: {
  vpa: string;
  name: string;
  amount: number;
  reference: string;
}): string | null {
  const vpa = opts.vpa.trim();
  // A UPI id is always name@handle; without one there is nothing to pay into.
  if (!vpa || !vpa.includes("@")) return null;

  const params = new URLSearchParams({
    pa: vpa,
    pn: opts.name || "BookMyNail",
    am: opts.amount.toFixed(2),
    cu: "INR",
    tn: opts.reference,
  });
  return `upi://pay?${params.toString()}`;
}
