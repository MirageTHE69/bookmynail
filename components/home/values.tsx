"use client";

import { useState } from "react";
import { Rise, Soft } from "@/components/motion/reveal";
import { VALUES } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Values() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="values" data-section-light className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="02" label="What we stand on" />

        <div className="mb-[clamp(30px,5vh,54px)] grid grid-cols-1 items-end gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
          <h2 className="m-0 font-display text-display4 font-normal leading-[0.96] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden">
              <Rise>Five commitments,</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic">every appointment.</Rise>
            </span>
          </h2>
          <Soft as="p" className="m-0 max-w-[32ch] text-[14.5px] leading-[1.7] text-ink/65">
            Each one is a promise you can hold us to — not a value on a wall.
          </Soft>
        </div>

        <div>
          {VALUES.map((v, i) => {
            const isHover = hovered === i;
            return (
              <div
                key={v.num}
                data-ledger-row
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative grid grid-cols-1 items-start gap-[clamp(16px,3vw,48px)] border-t border-ink/[0.14] p-[clamp(24px,3.6vh,38px)_clamp(14px,2vw,26px)] transition-colors duration-500 wide:grid-cols-[clamp(72px,8vw,132px)_minmax(0,0.85fr)_minmax(0,1.15fr)] ${
                  i === VALUES.length - 1 ? "border-b border-ink/[0.14]" : ""
                } ${isHover ? "bg-shell" : "bg-shell"}`}
                style={{
                  backgroundColor: isHover
                    ? `color-mix(in srgb, ${v.accent} 9%, #F4EEE7)`
                    : "#F4EEE7",
                }}
              >
                <span
                  className="font-display text-[clamp(38px,5.4vw,86px)] leading-[0.8] tracking-[-0.03em] transition-opacity duration-500"
                  style={{
                    color: v.accent,
                    opacity: isHover ? 1 : 0.16,
                  }}
                >
                  {v.num}
                </span>

                <div>
                  <h3 className="m-0 mb-3 font-display text-[clamp(24px,3.1vw,44px)] font-normal leading-none tracking-[-0.02em] text-ink">
                    {v.title}
                  </h3>
                  <span
                    className="inline-block rounded-full border px-[13px] py-[7px] text-[10px] uppercase tracking-[0.16em] transition-all duration-300"
                    style={{
                      borderColor: v.accent,
                      color: isHover ? "#FFFFFF" : v.accent,
                      backgroundColor: isHover ? v.accent : "transparent",
                    }}
                  >
                    {v.tag}
                  </span>
                </div>

                <p className="m-0 max-w-[52ch] pt-[clamp(2px,0.6vh,8px)] text-[15px] leading-[1.75] text-ink/70">
                  {v.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
