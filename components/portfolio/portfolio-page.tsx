"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rise, Soft } from "@/components/motion/reveal";
import Counter from "@/components/motion/counter";
import SiteNav from "@/components/site/site-nav";
import Footer from "@/components/site/footer";
import FloatingCTA from "@/components/site/floating-cta";
import {
  CATEGORY_LABELS,
  PORTFOLIO_FILTERS,
  PORTFOLIO_ITEMS,
  type PortfolioItem,
} from "@/lib/site";

const RADII = ["150px 150px 10px 10px", "10px", "10px", "150px 150px 10px 10px"];

export default function PortfolioPage({
  items = PORTFOLIO_ITEMS,
}: {
  items?: PortfolioItem[];
  filters?: string[];
}) {
  const [filter, setFilter] = useState<string>("All");

  const filteredItems =
    filter === "All" ? items : items.filter((item) => item.category === filter);

  return (
    <div className="relative overflow-x-hidden bg-bone text-ink">
      <SiteNav />

      {/* Header */}
      <header className="relative overflow-hidden text-bone">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(150deg, #56203C 0%, #8A3A3C 46%, #BF5634 78%, #E7A79F 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 80% at 4% 96%, rgba(0,0,0,0.34), transparent 62%)",
          }}
        />

        <div className="relative mx-auto max-w-shell px-gutter pb-[clamp(44px,7vh,80px)] pt-[clamp(110px,17vh,190px)]">
          <div className="mb-[clamp(24px,4vh,36px)] flex items-baseline gap-4">
            <span className="font-display text-sm italic text-blush">06</span>
            <span className="text-[10px] uppercase tracking-[0.24em] opacity-75">
              Full portfolio
            </span>
          </div>

          <h1 className="m-0 mb-[clamp(32px,5vh,56px)] font-display text-[clamp(40px,8vw,124px)] font-normal leading-[0.9] tracking-[-0.025em]">
            <span className="block overflow-hidden">
              <Rise hero>Every set,</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise hero innerClassName="italic">
                every occasion.
              </Rise>
            </span>
          </h1>

          <div className="grid grid-cols-1 items-end gap-[clamp(24px,4vw,56px)] border-t border-white/30 pt-6 nav:grid-cols-[minmax(0,1fr)_auto]">
            <Soft as="p" className="m-0 max-w-[52ch] text-[15.5px] leading-[1.7] opacity-90">
              Recent work from our artists, grouped by the kind of set. Found something you like?
              Note it in your booking and we&apos;ll recreate it.
            </Soft>
            <Soft as="p" className="m-0 whitespace-nowrap font-display text-[clamp(26px,3.2vw,42px)] leading-none tracking-[-0.02em]">
              <Counter to={items.length} />{" "}
              <span className="font-body text-[11px] uppercase tracking-[0.18em] opacity-65">
                sets shown
              </span>
            </Soft>
          </div>
        </div>
      </header>

      {/* Work Grid Section */}
      <section id="work" className="pb-[clamp(64px,11vh,130px)] pt-[clamp(36px,6vh,64px)]">
        <div className="mx-auto max-w-shell px-gutter">
          {/* Filters */}
          <div className="no-scrollbar mb-[clamp(24px,4.5vh,44px)] flex gap-[9px] overflow-x-auto pb-1 nav:overflow-visible">
            {PORTFOLIO_FILTERS.map((cat) => {
              const count =
                cat === "All" ? items.length : items.filter((i) => i.category === cat).length;
              const isSelected = filter === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={isSelected}
                  className="flex min-h-[44px] flex-none cursor-pointer items-center gap-1.5 rounded-full px-5 py-3 font-body text-[12.5px] tracking-[0.01em] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: isSelected ? "#1A1614" : "transparent",
                    color: isSelected ? "#FFFFFF" : "rgba(26,22,20,0.65)",
                    border: isSelected ? "1px solid #1A1614" : "1px solid rgba(26,22,20,0.22)",
                  }}
                >
                  <span>{cat}</span>
                  <span className="text-[11px] opacity-55">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 gap-[clamp(12px,1.6vw,20px)] sm:grid-cols-2 wide:grid-cols-4"
          >
            <AnimatePresence>
              {filteredItems.map((item, idx) => {
                const radius = RADII[idx % RADII.length];
                const catLabel = CATEGORY_LABELS[item.category] || item.category;

                return (
                  <motion.figure
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group relative m-0 overflow-hidden bg-shell"
                    style={{
                      borderRadius: radius,
                      aspectRatio: "3/4",
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-[101%] bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-[16px_18px] text-bone transition-transform duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      <span className="block font-display text-[17px] leading-[1.2]">
                        {item.title}
                      </span>
                      <span className="mt-1.5 block text-[9.5px] uppercase tracking-[0.18em] text-blush">
                        {catLabel}
                      </span>
                    </figcaption>
                  </motion.figure>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative overflow-hidden text-bone">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(150deg, #43305E 0%, #7B62A8 38%, #BF5634 76%, #E7A79F 100%)",
          }}
        />

        <div className="relative mx-auto max-w-shell px-gutter py-[clamp(56px,10vh,110px)]">
          <h2 className="m-0 mb-[clamp(26px,4.5vh,44px)] font-display text-[clamp(32px,6.4vw,96px)] font-normal leading-[0.94] tracking-[-0.025em]">
            <span className="block overflow-hidden">
              <Rise>Seen one you want?</Rise>
            </span>
          </h2>

          <Soft className="flex flex-wrap gap-3 border-t border-white/40 pt-[26px]">
            <Link
              href="/services#book"
              className="inline-block rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-transform duration-300 hover:-translate-y-1"
            >
              Book an appointment
            </Link>
            <a
              href="https://instagram.com/bookmynail"
              target="_blank"
              rel="noopener"
              className="inline-block rounded-full border border-white/55 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
            >
              Instagram
            </a>
          </Soft>
        </div>
      </section>

      <FloatingCTA />
      <Footer />
    </div>
  );
}
