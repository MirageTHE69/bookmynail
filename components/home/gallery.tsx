"use client";

import Image from "next/image";
import Link from "next/link";
import { Rise, Soft } from "@/components/motion/reveal";
import { CATEGORY_LABELS, type PortfolioItem } from "@/lib/site";
import SectionLabel from "./section-label";

/**
 * The homepage rail now draws from the same portfolio records as /portfolio,
 * so anything added in the admin panel shows up in both places. The
 * alternating tall/square rhythm from the design is positional, applied by
 * index via `galleryShape` rather than stored per item.
 */
export default function Gallery({
  items,
}: {
  items: (PortfolioItem & { ratio: string; radius: string; low: boolean })[];
}) {
  return (
    <section
      id="gallery"
      data-track-section="gallery"
      className="overflow-hidden bg-ink py-section-y text-bone"
    >
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="07" label="Recent work" dark />

        <div className="mb-[clamp(28px,5vh,52px)] grid grid-cols-1 items-end gap-[clamp(20px,4vw,56px)] nav:grid-cols-[minmax(0,1fr)_auto]">
          <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em] text-bone">
            <span className="block overflow-hidden">
              <Rise>Sets we&apos;ve done</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic text-blush">this month.</Rise>
            </span>
          </h2>

          <Soft>
            <Link
              href="/portfolio"
              data-track-id="gallery-full-portfolio"
              className="inline-block whitespace-nowrap rounded-full border border-white/45 px-6 py-3.5 text-[11px] uppercase tracking-[0.16em] text-bone no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
            >
              Full portfolio
            </Link>
          </Soft>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div className="no-scrollbar overflow-x-auto pb-1.5 pt-2">
        <div className="flex gap-[clamp(10px,1.4vw,18px)] px-gutter">
          {items.map((item) => (
            <figure
              key={item.id}
              className={`group m-0 w-[72vw] flex-none nav:w-[clamp(210px,23vw,320px)] ${
                item.low ? "self-end" : "self-start"
              }`}
            >
              <div
                className="relative overflow-hidden bg-white/5"
                style={{ borderRadius: item.radius, aspectRatio: item.ratio }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 760px) 72vw, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.18em] text-bone/60">
                {CATEGORY_LABELS[item.category] ?? item.category}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
