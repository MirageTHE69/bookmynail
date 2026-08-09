"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rise, Soft } from "@/components/motion/reveal";
import { duration, inr, type Service } from "@/lib/site";
import { track } from "@/components/analytics/tracker";
import SectionLabel from "./section-label";

const EDITORIAL = [0.16, 1, 0.3, 1] as const;

export default function Services({
  services: SERVICES,
  addonChips,
}: {
  services: Service[];
  addonChips: string[];
}) {
  // The export keeps exactly one panel open and ignores clicks on the open row.
  const [open, setOpen] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="services" data-track-section="services" className="bg-bone pb-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="04" label="Services & pricing" />

        <div className="mb-[clamp(30px,5vh,56px)] grid grid-cols-1 items-start gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] wide:items-end">
          <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
            <Rise>Four services.</Rise>
            <Rise innerClassName="italic text-plum">One doorstep.</Rise>
          </h2>
          <Soft as="p" className="m-0 max-w-[38ch] text-[14.5px] leading-[1.7] text-ink/65">
            Open a service to see what&apos;s included. Prices are per appointment for one person,
            travel within Ahmedabad included.
          </Soft>
        </div>

        <div>
          {SERVICES.map((s, i) => {
            const isOpen = i === open;
            const washOpacity = isOpen ? 0.14 : hover === i ? 0.07 : 0;

            return (
              <div
                key={s.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`relative overflow-hidden border-t border-ink/[0.16] ${
                  i === SERVICES.length - 1 ? "border-b" : ""
                }`}
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `linear-gradient(135deg,${s.grad[0]},${s.grad[1]})` }}
                  animate={{ opacity: washOpacity }}
                  transition={{ duration: isOpen ? 0.6 : 0.4 }}
                />

                <button
                  type="button"
                  aria-expanded={isOpen}
                  data-track-id={`service-${s.id}`}
                  onClick={() => {
                    setOpen(i);
                    track({
                      type: "service_interaction",
                      section: "services",
                      targetId: s.id,
                      targetLabel: s.name,
                      meta: { action: "accordion_open" },
                    });
                  }}
                  className="relative grid w-full min-h-[56px] cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-svc gap-y-1.5 border-none bg-transparent py-svc-y text-left font-body text-ink nav:grid-cols-[auto_44px_minmax(0,1fr)_auto] wide:grid-cols-[auto_56px_minmax(0,1fr)_auto_auto]"
                >
                  <span className="font-display text-[13px] italic opacity-50">{s.num}</span>

                  <motion.span
                    aria-hidden
                    className="hidden h-11 w-11 rounded-full nav:block"
                    style={{ background: `linear-gradient(140deg,${s.grad[0]},${s.grad[1]})` }}
                    animate={{ scale: isOpen ? 1.18 : 1 }}
                    transition={{ duration: 0.5, ease: EDITORIAL }}
                  />

                  <span className="font-display text-svc-name tracking-[-0.01em]">
                    {s.name}
                    {s.suffix && (
                      <span className="font-body text-[11px] tracking-[0.14em] opacity-50">
                        {" "}
                        {s.suffix}
                      </span>
                    )}
                  </span>

                  <span className="col-start-2 whitespace-nowrap font-body text-[11px] uppercase tracking-[0.16em] opacity-55 nav:col-start-3 wide:col-start-4">
                    {duration(s.minutes)}
                  </span>

                  <span className="whitespace-nowrap font-display text-svc-price">
                    {inr(s.price)}
                  </span>
                </button>

                <motion.div
                  className="relative overflow-hidden"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                >
                  <motion.div
                    animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -8 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="ml-0 grid grid-cols-1 gap-4 pb-[clamp(24px,3.6vh,38px)] wide:ml-[calc(13px+clamp(12px,2.6vw,36px))] wide:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)] wide:gap-svc"
                  >
                    <span className="hidden wide:block" />
                    <p className="m-0 max-w-[42ch] text-[14.5px] leading-[1.75] text-ink/[0.72]">
                      {s.body}
                    </p>
                    <ul className="m-0 grid list-none content-start gap-2.5 p-0">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-[13.5px] leading-[1.6]"
                        >
                          <span
                            className="mt-2.5 h-px w-3"
                            style={{ background: s.bulletColor }}
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="mt-[clamp(30px,5vh,56px)] grid grid-cols-1 items-start gap-[clamp(16px,4vw,52px)] nav:grid-cols-[auto_minmax(0,1fr)]">
          <Soft
            as="p"
            className="m-0 whitespace-nowrap pt-2.5 text-[10px] uppercase tracking-[0.24em] text-ink/50"
          >
            Add on
          </Soft>
          <Soft className="flex flex-wrap gap-[9px]">
            {addonChips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-ink/[0.22] px-[17px] py-2.5 text-[12.5px] tracking-[0.02em] transition-colors duration-[350ms] hover:border-plum hover:bg-plum hover:text-bone"
              >
                {c}
              </span>
            ))}
          </Soft>
        </div>
      </div>
    </section>
  );
}
