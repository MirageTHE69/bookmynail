"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Rise, Rule } from "@/components/motion/reveal";
import { VALUES } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Values() {
  const [tint, setTint] = useState(VALUES[0].tint);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The section wash takes the tint of whichever row is most in view.
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!rows.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const i = Number((hit.target as HTMLElement).dataset.index);
        if (!Number.isNaN(i)) setTint(VALUES[i].tint);
      },
      { threshold: [0.35, 0.6, 0.9], rootMargin: "-25% 0px -25% 0px" },
    );

    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="values"
      data-track-section="values"
      className="relative overflow-hidden bg-ink py-section-y text-bone"
    >
      <div
        className="absolute inset-0 opacity-[0.22] transition-[background] duration-[800ms] ease-out"
        style={{ background: `linear-gradient(145deg,${tint[0]},${tint[1]})` }}
      />

      <div className="relative mx-auto max-w-shell px-gutter">
        <SectionLabel num="02" label="What we stand on" dark />

        <h2 className="m-0 mb-block-gap max-w-[20ch] font-display text-display4 font-normal leading-[0.96] tracking-[-0.02em]">
          <Rise>Five commitments,</Rise>
          <Rise innerClassName="italic">every appointment.</Rise>
        </h2>

        <div>
          {VALUES.map((v, i) => (
            <motion.div
              key={v.num}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              data-index={i}
              data-value-row
              whileHover="hover"
              transition={{ duration: 0.45, ease: "easeOut" }}
              variants={{ hover: { paddingLeft: 14 } }}
              className={`relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-value border-t border-bone/[0.18] py-row-y wide:grid-cols-[auto_88px_minmax(0,1fr)] ${
                i === VALUES.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="font-display text-[13px] italic opacity-55">{v.num}</span>

              <motion.span
                aria-hidden
                variants={{ hover: { scale: 1.16 } }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="hidden h-[72px] w-[72px] rounded-full wide:block"
                style={{ background: `linear-gradient(140deg,${v.dot[0]},${v.dot[1]})` }}
              />

              <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-baseline gap-[clamp(12px,2.5vw,40px)]">
                <h3 className="m-0 font-display text-value-h font-normal tracking-[-0.01em]">
                  {v.title}
                </h3>
                <p className="m-0 max-w-[48ch] text-[14.5px] leading-[1.7] text-bone/[0.72]">
                  {v.body}
                </p>
              </div>

              <Rule
                className="absolute inset-x-0 -bottom-px h-px"
                style={{ background: v.rule }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
