"use client";

import Image from "next/image";
import { Rise, Soft, Wipe } from "@/components/motion/reveal";
import { useParallax } from "@/components/motion/use-parallax";
import Counter from "@/components/motion/counter";
import SectionLabel from "./section-label";

const STATS = [
  { to: 100, suffix: "%", label: "At-home service" },
  { to: 4, label: "Core services" },
  { to: 9, label: "Step booking" },
];

export default function About() {
  const imgRef = useParallax<HTMLDivElement>(-8, 8);

  return (
    <section id="about" data-track-section="about" className="pt-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="01" label="The motto" />

        <div className="grid grid-cols-1 items-start gap-grid-lg wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <h2 className="m-0 font-display text-display2 font-normal leading-[0.94] tracking-[-0.02em]">
            <Rise>Luxury isn&apos;t a</Rise>
            <Rise>location. It&apos;s the</Rise>
            <Rise innerClassName="italic text-terracotta">experience.</Rise>
          </h2>

          <div className="pt-[clamp(6px,1.4vh,14px)]">
            <Soft as="p" className="m-0 mb-[18px] max-w-[46ch] text-[15.5px] leading-[1.75] text-ink/[0.78]">
              Getting beautiful nails shouldn&apos;t mean travelling across the city, waiting in a
              crowded salon, or bending your day around someone else&apos;s schedule.
            </Soft>
            <Soft as="p" className="m-0 mb-[26px] max-w-[46ch] text-[15.5px] leading-[1.75] text-ink/[0.78]">
              So we bring the studio to you — the same premium products and technique, in your own
              space, at a time you choose.
            </Soft>

            <div className="grid grid-cols-3 gap-[18px] border-t border-ink/[0.14] pt-[22px]">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="m-0 font-display text-stat leading-none">
                    <Counter to={s.to} />
                    {s.suffix}
                  </p>
                  <p className="m-0 mt-1.5 text-[10px] uppercase tracking-[0.16em] text-ink/55">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Wipe className="relative mt-[clamp(48px,8vh,100px)] h-[clamp(240px,42vh,480px)] overflow-hidden">
        <div ref={imgRef} className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
          <Image
            src="/images/about-artist.webp"
            alt="Artist working at a client's home"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "50% 30%" }}
            priority
          />
        </div>
      </Wipe>
    </section>
  );
}
