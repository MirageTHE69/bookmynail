import { Soft } from "@/components/motion/reveal";
import { TRUST_METRICS } from "@/lib/site";

export default function TrustHighlights() {
  return (
    <section data-section-light className="bg-bone py-[clamp(26px,4vh,40px)]">
      <div className="mx-auto max-w-shell px-gutter">
        <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-[10px] border border-ink/[0.14] bg-ink/[0.14] nav:grid-cols-2 wide:grid-cols-4">
          {TRUST_METRICS.map((m) => (
            <Soft
              key={m.title}
              className="bg-shell p-[clamp(18px,3vh,26px)_clamp(16px,2vw,24px)]"
            >
              <p
                className="m-0 font-display text-[clamp(22px,2.6vw,34px)] leading-none tracking-[-0.02em]"
                style={{ color: m.color }}
              >
                {m.title}
              </p>
              <p className="mb-0 mt-2 text-xs leading-[1.5] text-ink/65">
                {m.subtitle}
              </p>
            </Soft>
          ))}
        </div>
      </div>
    </section>
  );
}
