"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rise, Soft } from "@/components/motion/reveal";
import { fullName, inr, type Service } from "@/lib/site";
import SectionLabel from "./section-label";

const ADDON_CHIPS = [
  "Gel removal · ₹299",
  "Chrome finish · ₹399",
  "Per-nail art · ₹99",
  "Gel pedicure · ₹1,099",
  "Nail repair · ₹149",
  "Second person · 15% off",
];

export default function Services({
  services,
  addonChips = ADDON_CHIPS,
}: {
  services: Service[];
  addonChips?: string[];
}) {
  const [open, setOpen] = useState(0);

  return (
    <section id="services" data-section-light className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="04" label="Services & pricing" />

        <div className="mb-[clamp(30px,5vh,56px)] grid grid-cols-1 items-end gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden">
              <Rise>Four services.</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic text-plum">One doorstep.</Rise>
            </span>
          </h2>
          <Soft as="p" className="m-0 max-w-[38ch] text-[14.5px] leading-[1.7] text-ink/65">
            Open a service to see what&apos;s included. Prices are per appointment for one person,
            travel within Ahmedabad included.
          </Soft>
        </div>

        <div className="flex flex-col gap-2.5">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                key={s.id}
                data-svc
                className="relative overflow-hidden rounded-xl border border-ink/[0.14] bg-shell"
              >
                {/* Background Wash on open */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`,
                  }}
                  animate={{ opacity: isOpen ? 0.14 : 0 }}
                  transition={{ duration: 0.5 }}
                />

                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="relative grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(12px,2.6vw,36px)] border-none bg-transparent p-[clamp(20px,3.2vh,32px)_clamp(18px,2.4vw,28px)] text-left font-body text-ink nav:grid-cols-[auto_56px_minmax(0,1fr)_auto_auto]"
                >
                  <span className="font-display text-[13px] italic opacity-50">
                    {s.num}
                  </span>

                  <span
                    className="hidden h-11 w-11 rounded-full transition-transform duration-500 nav:block"
                    style={{
                      background: `linear-gradient(140deg, ${s.grad[0]}, ${s.grad[1]})`,
                      transform: isOpen ? "scale(1.18)" : "scale(1)",
                    }}
                  />

                  <span className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-svc-name tracking-[-0.01em]">
                      {s.name}
                      {s.suffix && (
                        <span className="ml-1.5 font-body text-[11px] uppercase tracking-[0.14em] opacity-50">
                          {s.suffix}
                        </span>
                      )}
                    </span>
                    {s.badge && (
                      <span className="rounded-full bg-terracotta px-[11px] py-1 text-[9.5px] uppercase tracking-[0.16em] text-bone">
                        {s.badge}
                      </span>
                    )}
                  </span>

                  <span className="col-start-2 whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-ink/55 nav:col-auto">
                    {s.minutes} min
                  </span>

                  <span className="whitespace-nowrap font-display text-svc-price">
                    {inr(s.price)}
                  </span>
                </button>

                {/* Panel stays in the markup so the service copy and bullets
                    are present for crawlers even while collapsed. */}
                <motion.div
                  id={`svc-panel-${i}`}
                  role="region"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-[clamp(12px,2.6vw,36px)] pb-[clamp(24px,3.6vh,38px)] pl-[clamp(18px,2.4vw,28px)] pr-[clamp(18px,2.4vw,28px)] pt-0 nav:ml-[calc(13px+clamp(12px,2.6vw,36px))] nav:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)]">
                        <span className="hidden nav:block" />
                        <p className="m-0 max-w-[42ch] text-[14.5px] leading-[1.75] text-ink/75">
                          {s.body}
                        </p>
                        <ul className="m-0 grid list-none gap-2.5 p-0">
                          {s.bullets.map((b) => (
                            <li
                              key={b}
                              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 text-[13.5px] leading-[1.6]"
                            >
                              <span
                                className="mt-2.5 h-px w-3 flex-none"
                                style={{ backgroundColor: s.bulletColor || "#BF5634" }}
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Addons strip */}
        <div className="mt-[clamp(30px,5vh,56px)] grid grid-cols-1 items-start gap-[clamp(16px,4vw,52px)] wide:grid-cols-[auto_minmax(0,1fr)]">
          <p className="m-0 whitespace-nowrap pt-2.5 text-[10px] uppercase tracking-[0.24em] text-ink/50">
            Add on
          </p>
          <div className="flex flex-wrap gap-2.5">
            {addonChips.map((chip) => (
              <span
                key={chip}
                className="cursor-default rounded-full border border-ink/[0.14] bg-shell px-[17px] py-2.5 text-[12.5px] tracking-[0.02em] text-ink transition-colors duration-300 hover:border-plum hover:bg-plum hover:text-bone"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
