"use client";

import { motion } from "framer-motion";
import { Rule, Soft } from "@/components/motion/reveal";
import type { Step } from "@/lib/site";

/**
 * The four-step strip, shared by the homepage ("How it works") and the
 * Services page ("Before you book"). Each card lifts 6px on hover.
 */
export default function Steps({ steps, dark }: { steps: Step[]; dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-steps pf:grid-cols-2 pf:gap-y-[30px] wide:grid-cols-4">
      {steps.map((s) => (
        <motion.div
          key={s.num}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative border-t pt-[26px] ${
            dark ? "border-bone/20" : "border-ink/[0.18]"
          }`}
        >
          <Rule className="absolute inset-x-0 -top-px h-px" style={{ background: s.rule }} />
          <span className="font-display text-[13px] italic" style={{ color: s.numColor }}>
            {s.num}
          </span>
          <Soft
            as="h3"
            className="mb-2.5 mt-3.5 font-display text-step-h font-normal tracking-[-0.01em]"
          >
            {s.title}
          </Soft>
          <Soft
            as="p"
            className={`m-0 text-sm leading-[1.7] ${dark ? "text-bone/70" : "text-ink/[0.68]"}`}
          >
            {s.body}
          </Soft>
        </motion.div>
      ))}
    </div>
  );
}
