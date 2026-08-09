"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rise, Soft, Wipe } from "@/components/motion/reveal";
import { useParallax } from "@/components/motion/use-parallax";
import { HERO_VIDEO, SHADES, shadeDot, shadeWash } from "@/lib/site";
import { useWhatsappUrl } from "@/components/site/settings-provider";

export default function Hero() {
  const bookUrl = useWhatsappUrl();
  const [active, setActive] = useState(0);
  // Base layer holds the settled wash; `next` crossfades the incoming one on top.
  const [wash, setWash] = useState(() => shadeWash(SHADES[0]));
  const [next, setNext] = useState<{ grad: string; key: number } | null>(null);

  const videoRef = useParallax<HTMLDivElement>(-5, 7);

  const pick = (n: number) => {
    if (n === active) return;
    setActive(n);
    setNext({ grad: shadeWash(SHADES[n]), key: n });
  };

  return (
    <section
      data-nav-boundary
      data-track-section="hero"
      className="relative flex min-h-screen items-stretch overflow-hidden"
    >
      <div className="absolute inset-0" style={{ background: wash }} />
      {next && (
        <motion.div
          key={next.key}
          className="absolute inset-0"
          style={{ background: next.grad }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          onAnimationComplete={() => {
            setWash(next.grad);
            setNext(null);
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 8% 92%, rgba(0,0,0,0.34), transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-shell grid-cols-1 items-end gap-grid px-gutter pb-hero-bottom pt-hero-top wide:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <Rise hero className="mb-[clamp(14px,2.4vh,22px)]">
            <span className="text-[11px] uppercase tracking-[0.3em] text-bone/80">
              At-home nail studio · Ahmedabad
            </span>
          </Rise>

          <h1 className="m-0 mb-[clamp(20px,3.4vh,34px)] font-display text-hero font-normal leading-[0.9] tracking-[-0.02em] text-bone">
            <Rise hero>Luxury nails,</Rise>
            <Rise hero innerClassName="italic">
              at your door.
            </Rise>
          </h1>

          <Soft
            hero
            className="grid max-w-[600px] grid-cols-1 gap-[clamp(20px,3vh,30px)] border-t border-bone/30 pt-[clamp(18px,2.6vh,26px)]"
          >
            <p className="m-0 text-[15.5px] leading-[1.7] text-bone/90">
              Certified nail artists arrive at your home with sanitised tools and premium gel
              systems. No travel, no waiting room — just the salon, brought to your table.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={bookUrl}
                data-track-id="hero-whatsapp"
                target="_blank"
                rel="noopener"
                className="rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(26,22,20,0.24)]"
              >
                Book an appointment
              </a>
              <a
                href="#about"
                data-track-id="hero-how-it-works"
                className="rounded-full border border-bone/50 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-[3px] hover:bg-bone/[0.14]"
              >
                How it works
              </a>
            </div>
          </Soft>

          <Soft hero className="mt-[clamp(26px,4vh,44px)]">
            <p className="m-0 mb-3 text-[10px] uppercase tracking-[0.24em] text-bone/70">
              Pick a shade —{" "}
              <motion.span
                key={SHADES[active].name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {SHADES[active].name}
              </motion.span>
            </p>
            <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1 nav:overflow-visible">
              {SHADES.map((s, i) => (
                <motion.button
                  key={s.name}
                  type="button"
                  aria-label={s.name}
                  aria-pressed={i === active}
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  className="h-11 w-11 flex-none cursor-pointer rounded-full border p-0"
                  style={{ background: shadeDot(s) }}
                  animate={{
                    scale: i === active ? 1.22 : 1,
                    borderColor:
                      i === active ? "rgba(247,242,236,0.95)" : "rgba(247,242,236,0.35)",
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
          </Soft>
        </div>

        <Wipe
          hero
          className="relative order-first h-[46vh] min-h-[260px] self-end overflow-hidden rounded-[180px_180px_14px_14px] wide:order-none wide:h-[min(72vh,660px)]"
        >
          <div ref={videoRef} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
            <video
              className="h-full w-full object-cover"
              src={HERO_VIDEO}
              muted
              loop
              autoPlay
              playsInline
              aria-label="Hero video"
            />
          </div>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-[22px] py-5 text-[10px] uppercase tracking-[0.22em] text-bone">
            Gel · Builder gel · Extensions · Nail art
          </span>
        </Wipe>
      </div>
    </section>
  );
}
