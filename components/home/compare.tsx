import { Rise, Soft } from "@/components/motion/reveal";
import { BMN_POINTS, SALON_POINTS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Compare() {
  return (
    <section data-section-light className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="03" label="The difference" />

        <div className="mb-[clamp(30px,5vh,54px)] grid grid-cols-1 items-end gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <h2 className="m-0 font-display text-display4 font-normal leading-[0.96] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden">
              <Rise>Same set. Half</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic text-plum">the effort.</Rise>
            </span>
          </h2>
          <Soft as="p" className="m-0 max-w-[44ch] text-[15px] leading-[1.75] text-ink/70">
            Line up an appointment with us against a salon visit and the difference isn&apos;t the
            manicure — it&apos;s everything around it.
          </Soft>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded-xl nav:grid-cols-2">
          {/* Headers */}
          <div className="bg-shell px-[clamp(16px,2.4vw,30px)] py-[clamp(14px,2.2vh,20px)] text-[10px] uppercase tracking-[0.22em] text-ink/45">
            A traditional salon
          </div>
          <div
            className="hidden px-[clamp(16px,2.4vw,30px)] py-[clamp(14px,2.2vh,20px)] text-[10px] uppercase tracking-[0.22em] text-bone nav:block"
            style={{
              background:
                "linear-gradient(100deg, rgba(86,32,60,0.94), rgba(191,86,52,0.9))",
            }}
          >
            BookMyNail
          </div>

          {/* Rows */}
          {SALON_POINTS.map((salon, i) => {
            const bmn = BMN_POINTS[i];
            const isLast = i === SALON_POINTS.length - 1;
            return (
              <div key={salon} className="contents">
                <div
                  className={`border-t border-ink/[0.14] bg-shell px-[clamp(16px,2.4vw,30px)] py-[clamp(16px,2.6vh,24px)] text-[14.5px] leading-[1.6] text-ink/50 ${
                    isLast ? "border-b border-ink/[0.14]" : ""
                  }`}
                >
                  {salon}
                </div>
                <div
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 border-t border-white/20 px-[clamp(16px,2.4vw,30px)] py-[clamp(16px,2.6vh,24px)] text-[14.5px] leading-[1.6] text-bone ${
                    isLast ? "border-b border-white/20" : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(100deg, rgba(86,32,60,0.94), rgba(191,86,52,0.9))",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-3 -translate-y-1 bg-blush"
                  />
                  <span>{bmn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
