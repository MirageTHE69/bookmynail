"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Rise, Soft } from "@/components/motion/reveal";
import { GALLERY } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /**
   * Above 760px the rail drags horizontally as the section crosses the
   * viewport. Below that the export leaves it to native snap-scrolling.
   */
  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    if (window.innerWidth <= 760) return;

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = section.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const dist = Math.max(0, track.scrollWidth - window.innerWidth + 40);
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        track.style.transform = `translateX(${(-dist * p).toFixed(1)}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      data-track-section="gallery"
      className="overflow-hidden bg-ink py-section-y text-bone"
    >
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="05" label="Recent work" dark />

        <div className="mb-[clamp(28px,5vh,52px)] grid grid-cols-1 items-start gap-[clamp(20px,4vw,56px)] wide:grid-cols-[minmax(0,1fr)_auto] wide:items-end">
          <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
            <Rise>Sets we&apos;ve done</Rise>
            <Rise innerClassName="italic text-blush">this month.</Rise>
          </h2>
          <Soft as="span">
            <Link
              href="/portfolio"
              className="inline-block whitespace-nowrap rounded-full border border-bone/45 px-6 py-3.5 text-[11px] uppercase tracking-[0.16em] text-bone no-underline transition-all duration-300 hover:-translate-y-[3px] hover:bg-bone/[0.13]"
            >
              Full portfolio
            </Link>
          </Soft>
        </div>
      </div>

      <div className="no-scrollbar overflow-x-auto pb-1.5 [scroll-snap-type:x_mandatory] nav:[scroll-snap-type:none]">
        <div
          ref={trackRef}
          className="flex gap-[clamp(10px,1.4vw,18px)] px-gutter will-change-transform"
        >
          {GALLERY.map((g) => (
            <figure
              key={g.src}
              className={`group m-0 w-[72vw] flex-none [scroll-snap-align:center] nav:w-[clamp(210px,23vw,320px)] ${
                g.low ? "nav:self-end" : ""
              }`}
            >
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: g.radius, aspectRatio: g.ratio }}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 760px) 72vw, clamp(210px,23vw,320px)"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.18em] text-bone/55">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
