"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Rise, Soft } from "@/components/motion/reveal";
import Steps from "@/components/site/steps";
import SectionLabel from "@/components/home/section-label";
import {
  BOOKING_STEPS,
  GROUP_DISCOUNT,
  TIMES,
  duration,
  fullName,
  inr,
  type Addon,
  type Service,
} from "@/lib/site";
import { useSettings } from "@/components/site/settings-provider";
import { track } from "@/components/analytics/tracker";

const EDITORIAL = [0.16, 1, 0.3, 1] as const;

const CHIP =
  "min-h-[44px] cursor-pointer rounded-full border px-[18px] py-[11px] font-body text-[12.5px] transition-colors duration-300";
const FIELD =
  "min-h-[52px] w-full rounded-md border border-ink/[0.26] bg-transparent px-4 py-3.5 text-[15px] text-ink";
const LABEL = "text-[11px] uppercase tracking-[0.14em] text-ink/60";

export default function ServicesBody({
  services: SERVICES,
  addons: ADDONS,
}: {
  services: Service[];
  addons: Addon[];
}) {
  const { whatsapp } = useSettings();
  const [service, setService] = useState(SERVICES[0].id);
  const [addons, setAddons] = useState<string[]>([]);
  const [people, setPeople] = useState(1);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState(false);

  const clearMessage = () => setMessage("");

  const totals = useMemo(() => {
    const svc = SERVICES.find((s) => s.id === service) ?? SERVICES[0];
    const picked = ADDONS.filter((a) => addons.includes(a.id));
    const addonTotal = picked.reduce((sum, a) => sum + a.price, 0) * people;
    const base = svc.price * people;
    const discount = people > 1 ? Math.round((base + addonTotal) * GROUP_DISCOUNT) : 0;
    return { svc, picked, base, addonTotal, discount, total: base + addonTotal - discount };
  }, [service, addons, people]);

  // The export pulses the total whenever the priced inputs change.
  const totalControls = useAnimationControls();
  const prevKey = useRef<string>();
  useEffect(() => {
    const key = `${service}|${people}|${addons.join(",")}`;
    if (prevKey.current !== undefined && prevKey.current !== key) {
      totalControls.start({
        scale: [1.12, 1],
        opacity: [0.5, 1],
        transition: { duration: 0.45, ease: "easeOut" },
      });
    }
    prevKey.current = key;
  }, [service, people, addons, totalControls]);

  const toggleAddon = (id: string) => {
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : a.concat(id)));
    clearMessage();
  };

  const pickService = (id: string) => {
    setService(id);
    clearMessage();
    track({
      type: "service_interaction",
      section: "menu",
      targetId: id,
      meta: { action: "card_select" },
    });
    const el = document.getElementById("book");
    if (el) {
      // Clear the fixed nav, matching the `scroll-margin-top` in globals.css.
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
    }
  };

  const submit = async () => {
    const missing: string[] = [];
    if (!name.trim()) missing.push("name");
    if (phone.replace(/\D/g, "").length < 10) missing.push("phone number");
    if (!address.trim()) missing.push("address");
    if (!date) missing.push("date");
    if (!time) missing.push("time slot");
    if (missing.length) {
      setMessage(`Please add your ${missing.join(", ")}.`);
      setMessageOk(false);
      return;
    }

    const { svc, picked, total, discount } = totals;

    // Persist first, but never let a failure block WhatsApp — the message is
    // the actual conversion, the stored lead is a convenience for the studio.
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || null,
          area: area || null,
          address,
          notes: notes || null,
          serviceId: svc.id,
          serviceName: fullName(svc),
          addons: picked.map((a) => ({ id: a.id, label: a.label, price: a.price })),
          people,
          preferredDate: date,
          preferredTime: time,
          estimatedTotal: total,
          discount,
          sessionId:
            typeof window !== "undefined" ? sessionStorage.getItem("bmn_sid") : null,
        }),
      });
    } catch {
      /* offline or blocked — continue to WhatsApp regardless */
    }

    track({
      type: "lead",
      section: "book",
      targetId: svc.id,
      value: total,
      meta: { people, addons: picked.length },
    });

    const lines = [
      "Hi BookMyNail, I would like to book an appointment.",
      "",
      `Service: ${fullName(svc)} (${duration(svc.minutes)})`,
      `People: ${people}`,
      picked.length ? `Add-ons: ${picked.map((a) => a.label).join(", ")}` : "Add-ons: none",
      `Date: ${date}`,
      `Time: ${time}`,
      `Estimated total: ${inr(total)}`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Area: ${area || "—"}`,
      `Address: ${address}`,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean) as string[];

    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener",
    );
    setMessage("Opening WhatsApp with your booking summary.");
    setMessageOk(true);
  };

  const whenLabel = (() => {
    const fmt = (d: string) =>
      new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    if (date && time) return `${fmt(date)} · ${time}`;
    if (date) return `${fmt(date)} · pick a time`;
    if (time) return `${time} · pick a date`;
    return "Pick a date and time below";
  })();

  const peopleLabel =
    people > 1
      ? `${people} people · about ${duration(totals.svc.minutes * people)} total`
      : `One person · about ${duration(totals.svc.minutes)}`;

  return (
    <>
      {/* ── The menu ─────────────────────────────────────────────── */}
      <section id="menu" data-track-section="menu" className="py-section-y">
        <div className="mx-auto max-w-shell px-gutter">
          <SectionLabel num="01" label="The menu" />

          <div className="mb-[clamp(30px,5vh,56px)] grid grid-cols-1 items-start gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] wide:items-end">
            <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
              <Rise>Everything we do,</Rise>
              <Rise innerClassName="italic text-plum">at your table.</Rise>
            </h2>
            <Soft as="p" className="m-0 max-w-[38ch] text-[14.5px] leading-[1.7] text-ink/65">
              Tap a card to load it straight into the booking form below. Prices are per person, per
              appointment.
            </Soft>
          </div>

          <div className="grid grid-cols-1 gap-[clamp(12px,1.8vw,22px)] pf:grid-cols-2 wide:grid-cols-4">
            {SERVICES.map((s) => {
              const on = s.id === service;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  data-track-id={`svc-card-${s.id}`}
                  onClick={() => pickService(s.id)}
                  whileHover="hover"
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  variants={{ hover: { y: -6 } }}
                  className="relative flex min-h-[56px] cursor-pointer flex-col overflow-hidden rounded-lg border bg-bone p-0 text-left font-body text-ink transition-colors duration-[350ms]"
                  style={{ borderColor: on ? s.accent : "rgba(26,22,20,0.16)" }}
                >
                  <span
                    className="block h-[5px] w-full"
                    style={{
                      background: `linear-gradient(135deg,${s.cardGrad[0]},${s.cardGrad[1]})`,
                    }}
                  />
                  <span className="flex flex-col gap-3 p-[clamp(20px,3vh,28px)]">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[13px] italic text-ink/45">{s.num}</span>
                      <motion.span
                        aria-hidden
                        variants={{ hover: { scale: 1.2 } }}
                        transition={{ duration: 0.5, ease: EDITORIAL }}
                        className="h-[34px] w-[34px] rounded-full"
                        style={{
                          background: `linear-gradient(135deg,${s.cardGrad[0]},${s.cardGrad[1]})`,
                        }}
                      />
                    </span>
                    <span className="block font-display text-card-h leading-[1.1] tracking-[-0.01em]">
                      {fullName(s)}
                    </span>
                    <span className="block min-h-[66px] text-[13.5px] leading-[1.65] text-ink/[0.68]">
                      {s.blurb}
                    </span>
                    <span className="flex items-baseline justify-between gap-3 border-t border-ink/[0.14] pt-3.5">
                      <span className="font-display text-card-price">{inr(s.price)}</span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
                        {duration(s.minutes)}
                      </span>
                    </span>
                    <span
                      className="block text-[10px] uppercase tracking-[0.18em] transition-colors duration-[350ms]"
                      style={{ color: on ? s.accent : "rgba(26,22,20,0.42)" }}
                    >
                      {on ? "Selected ✓" : "Choose this"}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-[clamp(30px,5vh,56px)] grid grid-cols-1 items-start gap-[clamp(16px,4vw,52px)] nav:grid-cols-[auto_minmax(0,1fr)]">
            <Soft
              as="p"
              className="m-0 whitespace-nowrap pt-[11px] text-[10px] uppercase tracking-[0.24em] text-ink/50"
            >
              Add on
            </Soft>
            <Soft className="flex flex-wrap gap-[9px]">
              {ADDONS.map((a) => {
                const on = addons.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAddon(a.id)}
                    className={`${CHIP} ${
                      on
                        ? "border-plum bg-plum text-bone"
                        : "border-ink/[0.22] bg-transparent text-ink"
                    }`}
                  >
                    {`${a.label} · ${inr(a.price)}`}
                  </button>
                );
              })}
            </Soft>
          </div>
        </div>
      </section>

      {/* ── Before you book ──────────────────────────────────────── */}
      <section id="steps" data-track-section="steps" className="relative overflow-hidden bg-ink py-section-y text-bone">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "linear-gradient(145deg,#56203C,#BF5634)" }}
        />
        <div className="relative mx-auto max-w-shell px-gutter">
          <SectionLabel num="02" label="Before you book" dark />
          <h2 className="m-0 mb-block-gap max-w-[16ch] font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
            <Rise>Book it in four steps.</Rise>
            <Rise innerClassName="italic">We handle the rest.</Rise>
          </h2>
          <Steps steps={BOOKING_STEPS} dark />
        </div>
      </section>

      {/* ── Booking form ─────────────────────────────────────────── */}
      <section id="book" data-track-section="book" className="py-section-y">
        <div className="mx-auto max-w-shell px-gutter">
          <SectionLabel num="03" label="Book your appointment" />

          <h2 className="m-0 mb-[clamp(32px,5vh,56px)] max-w-[15ch] font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
            <Rise>Tell us where</Rise>
            <Rise innerClassName="italic text-terracotta">and when.</Rise>
          </h2>

          <div className="grid grid-cols-1 items-start gap-[clamp(24px,4vw,64px)] wide:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
            <div>
              <p className="m-0 mb-[18px] text-[10px] uppercase tracking-[0.22em] text-ink/45">
                Your service
              </p>

              <div className="mb-[clamp(30px,5vh,46px)] grid gap-4">
                <label className="grid gap-[9px]">
                  <span className={LABEL}>Service</span>
                  <select
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                      clearMessage();
                    }}
                    className={FIELD}
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {`${fullName(s)} · ${inr(s.price)}`}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-1 gap-4 pf:grid-cols-2">
                  <label className="grid gap-[9px]">
                    <span className={LABEL}>People</span>
                    <div className="flex min-h-[52px] items-center gap-3 rounded-md border border-ink/[0.26] px-2.5 py-1.5">
                      <button
                        type="button"
                        aria-label="Fewer people"
                        onClick={() => {
                          setPeople((p) => Math.max(1, p - 1));
                          clearMessage();
                        }}
                        className="h-10 w-10 cursor-pointer rounded-full border border-ink/20 bg-transparent text-[19px] leading-none text-ink"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-display text-[22px]">{people}</span>
                      <button
                        type="button"
                        aria-label="More people"
                        onClick={() => {
                          setPeople((p) => Math.min(6, p + 1));
                          clearMessage();
                        }}
                        className="h-10 w-10 cursor-pointer rounded-full border border-ink/20 bg-transparent text-[19px] leading-none text-ink"
                      >
                        +
                      </button>
                    </div>
                  </label>

                  <label className="grid gap-[9px]">
                    <span className={LABEL}>Preferred date</span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        clearMessage();
                      }}
                      className={FIELD}
                    />
                  </label>
                </div>

                <div className="grid gap-[9px]">
                  <span className={LABEL}>Preferred time</span>
                  <div className="flex flex-wrap gap-[9px]">
                    {TIMES.map((t) => {
                      const on = time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            setTime(t);
                            clearMessage();
                          }}
                          className={`${CHIP} ${
                            on
                              ? "border-terracotta bg-terracotta text-bone"
                              : "border-ink/[0.22] bg-transparent text-ink"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-[9px]">
                  <span className={LABEL}>Add-ons</span>
                  <div className="flex flex-wrap gap-[9px]">
                    {ADDONS.map((a) => {
                      const on = addons.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleAddon(a.id)}
                          className={`${CHIP} ${
                            on
                              ? "border-plum bg-plum text-bone"
                              : "border-ink/[0.22] bg-transparent text-ink"
                          }`}
                        >
                          {`${a.label} · ${inr(a.price)}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="m-0 mb-[18px] text-[10px] uppercase tracking-[0.22em] text-ink/45">
                Your details
              </p>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 pf:grid-cols-2">
                  <label className="grid gap-[9px]">
                    <span className={LABEL}>Full name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearMessage();
                      }}
                      placeholder="Your name"
                      className={FIELD}
                    />
                  </label>
                  <label className="grid gap-[9px]">
                    <span className={LABEL}>Phone</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearMessage();
                      }}
                      placeholder="10-digit mobile"
                      className={FIELD}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 pf:grid-cols-2">
                  <label className="grid gap-[9px]">
                    <span className={LABEL}>Area</span>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        clearMessage();
                      }}
                      placeholder="e.g. Satellite, Bodakdev"
                      className={FIELD}
                    />
                  </label>
                  <label className="grid gap-[9px]">
                    <span className={LABEL}>
                      Email{" "}
                      <span className="tracking-normal opacity-60 [text-transform:none]">
                        (optional)
                      </span>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearMessage();
                      }}
                      placeholder="you@email.com"
                      className={FIELD}
                    />
                  </label>
                </div>

                <label className="grid gap-[9px]">
                  <span className={LABEL}>Full address</span>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      clearMessage();
                    }}
                    placeholder="Flat / house, building, street, landmark"
                    className={`${FIELD} resize-y leading-[1.6]`}
                  />
                </label>

                <label className="grid gap-[9px]">
                  <span className={LABEL}>
                    Anything else{" "}
                    <span className="tracking-normal opacity-60 [text-transform:none]">
                      (optional)
                    </span>
                  </span>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      clearMessage();
                    }}
                    placeholder="Design ideas, allergies, parking notes"
                    className={`${FIELD} resize-y leading-[1.6]`}
                  />
                </label>
              </div>
            </div>

            {/* ── Live summary ───────────────────────────────────── */}
            <aside className="overflow-hidden rounded-[10px] text-bone wide:sticky wide:top-[26px]">
              <div
                className="p-[clamp(24px,4vh,34px)]"
                style={{
                  background:
                    "linear-gradient(150deg,#56203C 0%,#8A3A3C 52%,#BF5634 100%)",
                }}
              >
                <p className="m-0 mb-[22px] text-[10px] uppercase tracking-[0.22em] opacity-[0.78]">
                  Your appointment
                </p>
                <p className="m-0 mb-1.5 font-display text-sum-svc leading-[1.1]">
                  {fullName(totals.svc)}
                </p>
                <p className="m-0 mb-[22px] text-xs tracking-[0.02em] opacity-[0.78]">
                  {whenLabel}
                </p>

                <div className="grid gap-[11px] border-t border-bone/30 pt-[18px]">
                  <div className="flex justify-between gap-3.5 text-[13.5px]">
                    <span className="opacity-85">
                      {fullName(totals.svc)}
                      {people > 1 ? ` × ${people}` : ""}
                    </span>
                    <span>{inr(totals.base)}</span>
                  </div>

                  {totals.picked.map((a) => (
                    <div key={a.id} className="flex justify-between gap-3.5 text-[13.5px]">
                      <span className="opacity-85">
                        {a.label}
                        {people > 1 ? ` × ${people}` : ""}
                      </span>
                      <span>{inr(a.price * people)}</span>
                    </div>
                  ))}

                  {totals.discount > 0 && (
                    <div className="flex justify-between gap-3.5 text-[13.5px] text-blush">
                      <span>Group discount (15%)</span>
                      <span>−{inr(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between gap-3.5 text-[13.5px] opacity-70">
                    <span>Travel in Ahmedabad</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="mt-[18px] flex items-baseline justify-between gap-3.5 border-t border-bone/30 pt-[18px]">
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-[0.78]">
                    Estimated total
                  </span>
                  <motion.span
                    animate={totalControls}
                    className="font-display text-sum-total leading-none"
                  >
                    {inr(totals.total)}
                  </motion.span>
                </div>

                <p className="m-0 mt-3.5 text-[11.5px] leading-[1.6] opacity-[0.72]">
                  {peopleLabel}
                </p>
              </div>

              <div className="bg-ink p-[clamp(20px,3vh,26px)]">
                <button
                  type="button"
                  onClick={() => void submit()}
                  className="min-h-[54px] w-full cursor-pointer rounded-full border-none bg-bone font-body text-xs uppercase tracking-[0.14em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Send on WhatsApp
                </button>
                <p
                  role="status"
                  className="m-0 mt-3.5 min-h-[18px] text-[11.5px] leading-[1.6]"
                  style={{ color: messageOk ? "#E7A79F" : "#F0A9A0" }}
                >
                  {message}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
