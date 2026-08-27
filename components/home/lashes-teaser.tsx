import Link from "next/link";
import { Rise, Soft } from "@/components/motion/reveal";
import { inr, type Service } from "@/lib/site";

/**
 * Homepage lash teaser (section 05), transcribed from the design export.
 * Prices come from the database so they stay admin-editable; the descriptive
 * one-liners are design copy and live here.
 */
const BLURBS: Record<string, string> = {
  "lash-classic": "One extension per lash · clean and natural",
  "lash-hybrid": "Classic and volume mixed · textured glam",
  "lash-volume": "Fine fans per lash · fuller and fluffier",
  "lash-russian": "Maximum density · editorial finish",
};

const SHORT_NAMES: Record<string, string> = {
  "lash-russian": "Russian & Mega",
};

export default function LashesTeaser({ lashes }: { lashes: Service[] }) {
  return (
    <section
      id="lashes-teaser"
      data-track-section="lashes-teaser"
      className="relative overflow-hidden bg-ink text-bone"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "linear-gradient(145deg,#43305E,#B4A2D4)" }}
      />

      <div className="relative mx-auto max-w-shell px-gutter py-section-y">
        <div className="mb-head-gap flex flex-wrap items-baseline gap-4">
          <Soft as="span" className="font-display text-sm italic text-lilac">
            05
          </Soft>
          <Soft as="span" className="text-[10px] uppercase tracking-[0.24em] text-white/55">
            Signature lash menu
          </Soft>
          <Soft
            as="span"
            className="rounded-full bg-blush px-3 py-1.5 text-[9.5px] uppercase tracking-[0.18em] text-ink"
          >
            New
          </Soft>
        </div>

        <div className="grid grid-cols-1 items-start gap-[clamp(26px,5vw,80px)] wide:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <h2 className="m-0 mb-[clamp(20px,3vh,30px)] font-display text-display4 font-normal leading-[0.94] tracking-[-0.025em]">
              <Rise>Lashes too,</Rise>
              <Rise innerClassName="italic">mapped to your eyes.</Rise>
            </h2>

            <Soft
              as="p"
              className="m-0 mb-[clamp(24px,4vh,34px)] max-w-[46ch] text-[15.5px] leading-[1.7] text-white/[0.82]"
            >
              Fifteen sets across four densities, from a clean classic to editorial mega volume.
              Choose the look you want and we map it to your own eye shape at your table.
            </Soft>

            <Soft className="mb-[clamp(24px,4vh,34px)] grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.16] bg-white/[0.16]">
              {[
                { value: "6–8 wks", label: "A full set, with infills" },
                { value: "4 looks", label: "Natural, cat, doll, wispy" },
              ].map((f) => (
                <div
                  key={f.value}
                  className="bg-ink/[0.34] px-[clamp(14px,1.8vw,20px)] py-[clamp(16px,2.4vh,22px)]"
                >
                  <p className="m-0 font-display text-[clamp(20px,2.3vw,30px)] leading-none tracking-[-0.02em] text-blush">
                    {f.value}
                  </p>
                  <p className="m-0 mt-[7px] text-[11.5px] leading-[1.5] text-white/[0.62]">
                    {f.label}
                  </p>
                </div>
              ))}
            </Soft>

            <Soft className="flex flex-wrap gap-[11px]">
              <Link
                href="/services#lashes"
                data-track-id="lash-teaser-menu"
                className="rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-transform duration-300 hover:-translate-y-[3px]"
              >
                See the lash menu
              </Link>
              <Link
                href="/services#book"
                data-track-id="lash-teaser-book"
                className="rounded-full border border-white/50 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-[3px] hover:bg-white/[0.14]"
              >
                Book lashes
              </Link>
            </Soft>
          </div>

          <Soft>
            <p className="m-0 mb-3.5 text-[10px] uppercase tracking-[0.22em] text-white/50">
              Four densities
            </p>
            <div className="border-t border-white/[0.16]">
              {lashes.map((l) => (
                <Link
                  key={l.id}
                  href="/services#lashes"
                  data-track-id={`lash-row-${l.id}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-white/[0.16] px-[clamp(14px,1.8vw,20px)] py-[clamp(15px,2.4vh,21px)] text-inherit no-underline transition-all duration-[350ms] hover:bg-white/[0.06] hover:pl-[clamp(20px,2.4vw,28px)]"
                >
                  <span>
                    <span className="block font-display text-[clamp(18px,2vw,26px)] leading-[1.15] tracking-[-0.01em]">
                      {SHORT_NAMES[l.id] ?? l.name}
                    </span>
                    <span className="mt-[5px] block text-xs leading-[1.5] text-white/60">
                      {BLURBS[l.id] ?? l.blurb}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-display text-[clamp(17px,1.9vw,23px)]">
                    from {inr(l.price)}
                  </span>
                </Link>
              ))}
            </div>
            <p className="m-0 mt-3.5 text-[11.5px] leading-[1.6] text-white/50">
              Lash lift, tint and removal are booked separately.
            </p>
          </Soft>
        </div>
      </div>
    </section>
  );
}
