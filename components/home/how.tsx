import { Rise, Soft } from "@/components/motion/reveal";
import { HOME_STEPS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function How() {
  return (
    <section id="how" data-section-light className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="07" label="How booking works" />

        <div className="mb-[clamp(32px,6vh,64px)] grid grid-cols-1 items-end gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
          <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden">
              <Rise>Book it in four steps.</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic text-terracotta">We handle the rest.</Rise>
            </span>
          </h2>
          <Soft as="p" className="m-0 max-w-[34ch] text-[14.5px] leading-[1.7] text-ink/65">
            Everything happens on this site — no calls, no waiting for a reply to know your price.
          </Soft>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(14px,2.4vw,32px)] nav:grid-cols-2 wide:grid-cols-4">
          {HOME_STEPS.map((s) => (
            <div
              key={s.num}
              data-step
              className="relative overflow-hidden rounded-xl border border-ink/[0.14] bg-shell p-[26px_clamp(18px,2vw,24px)_clamp(20px,3vh,26px)] transition-transform duration-400 hover:-translate-y-1.5"
            >
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: s.rule }}
              />
              <span
                className="font-display text-[13px] italic"
                style={{ color: s.numColor }}
              >
                {s.num}
              </span>
              <h3 className="m-0 mb-2.5 mt-3.5 font-display text-[clamp(19px,2.1vw,28px)] font-normal tracking-[-0.01em] text-ink">
                {s.title}
              </h3>
              <p className="m-0 text-sm leading-[1.7] text-ink/70">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
