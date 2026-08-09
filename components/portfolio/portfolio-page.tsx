"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, Rise, Soft } from "@/components/motion/reveal";
import Counter from "@/components/motion/counter";
import SiteNav from "@/components/site/site-nav";
import Footer from "@/components/site/footer";
import type { PortfolioItem } from "@/lib/site";
import { useSettings, useWhatsappUrl } from "@/components/site/settings-provider";

export default function PortfolioPage({
  items: PORTFOLIO_ITEMS,
  filters: PORTFOLIO_FILTERS,
}: {
  items: PortfolioItem[];
  filters: string[];
}) {
  const [filter, setFilter] = useState("All");
  const { instagram } = useSettings();
  const bookUrl = useWhatsappUrl();

  const items =
    filter === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((i) => i.category === filter);

  return (
    <div className="relative overflow-x-hidden bg-bone text-ink">
      <SiteNav />

      {/* ── Header ───────────────────────────────────────────────── */}
      <header data-nav-boundary data-track-section="portfolio-header" className="overflow-hidden bg-ink text-bone">
        <div className="mx-auto max-w-shell-pf px-gutter-pf pb-[clamp(48px,8vh,90px)] pt-[clamp(120px,20vh,220px)]">
          <div className="mb-[34px] flex items-baseline gap-5">
            <Soft as="span" className="font-display text-[13px] tracking-[0.2em] text-terracotta">
              05
            </Soft>
            <Soft as="span" className="text-xs uppercase tracking-[0.2em] text-bone/60">
              Full portfolio
            </Soft>
          </div>

          <h1 className="m-0 mb-[clamp(36px,6vh,60px)] font-display text-hero-pf font-normal leading-[0.94] tracking-[-0.03em] text-bone">
            <Rise hero>Every set,</Rise>
            <Rise hero delay={0.27}>
              every occasion.
            </Rise>
          </h1>

          <div className="grid grid-cols-1 items-start gap-6 border-t border-bone/30 pt-[26px] pfmd:grid-cols-[minmax(0,1fr)_auto] pfmd:items-end pfmd:gap-10">
            <Soft as="p" className="m-0 max-w-[52ch] text-base leading-[1.7] text-bone/[0.82]">
              Recent work from the studio, grouped by category. Found something you like? Send us a
              screenshot when you book and we&apos;ll match it.
            </Soft>
            <Soft
              as="p"
              className="m-0 whitespace-nowrap font-display text-count-pf leading-none tracking-[-0.03em] text-bone"
            >
              <Counter to={PORTFOLIO_ITEMS.length} />{" "}
              <span className="text-xs uppercase tracking-[0.18em] opacity-60">sets shown</span>
            </Soft>
          </div>
        </div>
      </header>

      {/* ── Work grid ────────────────────────────────────────────── */}
      <section id="work" data-track-section="work" className="pb-[clamp(72px,12vh,140px)] pt-[clamp(40px,7vh,72px)]">
        <div className="mx-auto max-w-shell-pf px-gutter-pf">
          <div className="no-scrollbar mb-[clamp(28px,5vh,52px)] flex gap-[clamp(18px,3vw,40px)] overflow-x-auto border-b-2 border-ink/40 nav:overflow-visible">
            {PORTFOLIO_FILTERS.map((f) => {
              const on = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  data-track-id={`pf-filter-${f}`}
                  onClick={() => setFilter(f)}
                  className={`relative min-h-[44px] flex-none cursor-pointer border-none bg-transparent p-0 pb-4 font-display text-filter-pf tracking-[-0.01em] transition-colors duration-300 ${
                    on ? "text-ink" : "text-ink/45"
                  }`}
                >
                  {f}
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-terracotta transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                    style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </button>
              );
            })}
          </div>

          <div className="grid auto-rows-[clamp(130px,12.5vw,200px)] grid-cols-1 gap-[clamp(12px,1.6vw,22px)] pf:grid-cols-2 pfmd:grid-cols-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group m-0"
                style={{ gridRow: `span ${filter === "All" ? item.span : 1}` }}
              >
                <Image
                  src={item.src}
                  alt={`${item.category} set by BookMyNail`}
                  fill
                  sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/90 to-transparent px-[18px] py-4 text-[11px] uppercase tracking-[0.18em] text-bone transition-transform duration-[450ms] ease-out group-hover:translate-y-0">
                  {item.category}
                </figcaption>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section data-track-section="portfolio-cta" className="overflow-hidden bg-terracotta text-bone">
        <div className="mx-auto max-w-shell-pf px-gutter-pf py-section-y-pf">
          <h2 className="m-0 mb-[clamp(28px,5vh,44px)] font-display text-display-pf font-normal leading-[0.95] tracking-[-0.03em] text-bone">
            <Rise>Seen one you want?</Rise>
          </h2>
          <Soft className="flex flex-wrap gap-3 border-t border-bone/40 pt-7">
            <a
              href={bookUrl}
              data-track-id="portfolio-whatsapp"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-transform duration-300 hover:-translate-y-[3px]"
            >
              WhatsApp us
            </a>
            <a
              href={instagram}
              data-track-id="portfolio-instagram"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center rounded-full border border-bone/55 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-transform duration-300 hover:-translate-y-[3px]"
            >
              Instagram
            </a>
          </Soft>
        </div>
      </section>

      <Footer />
    </div>
  );
}
