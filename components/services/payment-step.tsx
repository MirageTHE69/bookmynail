"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { inr } from "@/lib/site";
import { upiLink } from "@/lib/payment";
import { useSettings, useWhatsappUrl } from "@/components/site/settings-provider";

/**
 * Deposit step shown after a booking is placed.
 *
 * Order matters here: the UPI button comes before the QR because most bookings
 * are on a phone, and you cannot scan a QR with the same phone that is showing
 * it. The QR is the desktop fallback.
 *
 * Uploading a screenshot moves the booking to `payment_submitted` — never to
 * confirmed. The owner verifies against her own GPay app.
 */
export default function PaymentStep({
  leadId,
  reference,
  deposit,
  total,
  summary,
  onReset,
}: {
  leadId: number | null;
  reference: string;
  deposit: number;
  total: number;
  summary: string;
  onReset: () => void;
}) {
  const { upiId, upiName } = useSettings();
  const link = upiLink({ vpa: upiId, name: upiName, amount: deposit, reference });
  const waUrl = useWhatsappUrl(
    `Hi BookMyNail, I've just booked ${reference}. How should I pay the ${inr(deposit)} deposit?`,
  );

  const [qr, setQr] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { margin: 1, width: 320, color: { dark: "#1A1614", light: "#FFFFFF" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [link]);

  const upload = async (file: File) => {
    if (!leadId) {
      setState("error");
      setMessage("This booking could not be matched. Please send the screenshot on WhatsApp.");
      return;
    }
    setState("sending");
    setMessage("");
    try {
      const body = new FormData();
      body.append("screenshot", file);
      body.append("reference", reference);
      const res = await fetch(`/api/leads/${leadId}/payment`, { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed.");
      setState("sent");
    } catch (e) {
      setState("error");
      setMessage(
        e instanceof Error ? e.message : "Could not upload. Please send it on WhatsApp instead.",
      );
    }
  };

  return (
    <div role="status">
      <p className="m-0 text-[10px] uppercase tracking-[0.2em] text-blush">Booking received</p>
      <p className="m-0 mt-2 font-display text-[clamp(24px,2.6vw,34px)] leading-none text-bone">
        {reference}
      </p>
      <p className="m-0 mt-3.5 text-[12px] leading-[1.65] text-bone/70">{summary}</p>

      {deposit > 0 && link ? (
        <>
          <div className="mt-5 rounded-lg border border-bone/20 bg-bone/[0.06] p-4">
            <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-bone/55">
              Deposit to hold your slot
            </p>
            <p className="m-0 mt-1 font-display text-[28px] leading-none text-bone">
              {inr(deposit)}
            </p>
            <p className="m-0 mt-1.5 text-[11.5px] leading-[1.55] text-bone/55">
              Balance of {inr(total - deposit)} after the appointment.
            </p>

            <a
              href={link}
              data-track-id="pay-upi"
              className="mt-3.5 flex min-h-[50px] items-center justify-center rounded-full bg-bone text-[12px] font-medium uppercase tracking-[0.14em] text-ink no-underline transition-transform duration-300 hover:-translate-y-0.5"
            >
              Pay {inr(deposit)} with GPay
            </a>
            <p className="m-0 mt-2 text-center text-[11px] text-bone/45">
              Opens GPay, PhonePe or Paytm with the amount and {reference} filled in.
            </p>

            {qr && (
              <div className="mt-4 border-t border-bone/15 pt-4 text-center">
                <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.18em] text-bone/45">
                  Or scan from another phone
                </p>
                {/* Plain img: a data: URL needs no optimisation pipeline. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr}
                  alt={`UPI QR code to pay ${inr(deposit)} for booking ${reference}`}
                  width={150}
                  height={150}
                  className="mx-auto rounded-md bg-white p-2"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            {state === "sent" ? (
              <div className="rounded-lg border border-blush/30 bg-blush/10 p-4">
                <p className="m-0 text-[12.5px] leading-[1.6] text-bone">
                  Screenshot received. Your artist will check the payment and call{" "}
                  to confirm your slot.
                </p>
              </div>
            ) : (
              <>
                <p className="m-0 mb-2 text-[11.5px] leading-[1.55] text-bone/60">
                  Paid? Send the screenshot so we can confirm your slot.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={state === "sending"}
                  data-track-id="pay-upload"
                  className="flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-full border border-bone/40 bg-transparent font-body text-xs uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:bg-bone/10 disabled:opacity-50"
                >
                  {state === "sending" ? "Uploading…" : "Upload payment screenshot"}
                </button>
                {state === "error" && (
                  <p className="m-0 mt-2 text-[11.5px] leading-[1.5] text-[#F0A9A0]">{message}</p>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        /* No UPI id configured yet — fall back rather than show a dead button. */
        <div className="mt-5 rounded-lg border border-bone/20 bg-bone/[0.06] p-4">
          <p className="m-0 text-[12.5px] leading-[1.6] text-bone/75">
            Your artist will message you to arrange the deposit and confirm the slot.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="mt-3 flex min-h-[48px] items-center justify-center rounded-full bg-bone text-xs uppercase tracking-[0.14em] text-ink no-underline"
          >
            Message us on WhatsApp
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-4 min-h-[44px] w-full cursor-pointer rounded-full border-none bg-transparent font-body text-[11px] uppercase tracking-[0.14em] text-bone/45 transition-colors hover:text-bone"
      >
        Book another appointment
      </button>
    </div>
  );
}
