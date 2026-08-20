"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rise, Soft } from "@/components/motion/reveal";
import { FAQS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" data-section-light className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="09" label="Before you ask" />

        <div className="mb-[clamp(28px,5vh,48px)] grid grid-cols-1 items-end gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <h2 className="m-0 font-display text-display4 font-normal leading-[0.96] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden">
              <Rise>Questions we get</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic text-plum">most often.</Rise>
            </span>
          </h2>
          <Soft as="p" className="m-0 max-w-[36ch] text-[14.5px] leading-[1.7] text-ink/65">
            Anything not covered here is answered in the booking form before you confirm — nothing
            is charged up front.
          </Soft>
        </div>

        <div className="grid gap-2.5">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.num}
                data-faq
                className={`overflow-hidden rounded-xl border bg-shell transition-colors duration-300 ${
                  isOpen ? "border-plum" : "border-ink/[0.14]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="grid min-h-[56px] w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(14px,2.4vw,28px)] border-none bg-transparent p-[clamp(18px,2.8vh,26px)_clamp(18px,2.4vw,28px)] text-left font-body text-ink"
                >
                  <span className="font-display text-[13px] italic text-terracotta">
                    {faq.num}
                  </span>
                  <span className="font-display text-[clamp(17px,1.9vw,25px)] leading-[1.25] tracking-[-0.01em]">
                    {faq.q}
                  </span>
                  <span
                    className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full border text-[15px] leading-none transition-all duration-300 ${
                      isOpen
                        ? "border-plum bg-plum text-bone rotate-180"
                        : "border-ink/30 bg-transparent text-ink"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-[clamp(14px,2.4vw,28px)] pb-[clamp(20px,3vh,28px)] pl-[clamp(18px,2.4vw,28px)] pr-[clamp(18px,2.4vw,28px)] pt-0">
                        <span className="w-[13px]" />
                        <p className="m-0 max-w-[62ch] text-[14.5px] leading-[1.75] text-ink/75">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
