"use client";

import { useState } from "react";
import { Rise, Soft } from "@/components/motion/reveal";
import {
  LASH_AFTERCARE,
  LASH_FACTS,
  LASH_LOOKS,
  LASH_SIGNATURE,
  LASH_TIERS,
} from "@/lib/lashes";
import { duration, inr, type Service } from "@/lib/site";

/**
 * The lash menu (Services section 02), transcribed from the design export.
 *
 * Step one picks a look, which redraws the eye map; step two lists the tiers
 * available for that look. Bookable prices for lift/tint/removal come from the
 * database via `extras`; the mapping data is design content in `lib/lashes.ts`.
 */
export default function LashMenu({ extras }: { extras: Service[] }) {
  // The export opens on Cat Eye, not the first entry.
  const [lookId, setLookId] = useState("cat");
  const look = LASH_LOOKS.find((l) => l.id === lookId) ?? LASH_LOOKS[0];
  const signature = LASH_SIGNATURE.filter((s) => s.looks.includes(look.id));

  return (
    <section
      id="lashes"
      data-track-section="lashes"
      className="border-t border-shell-line bg-shell py-section-y"
    >
      <div className="mx-auto max-w-shell px-gutter">
        <div className="mb-head-gap flex flex-wrap items-baseline gap-4">
          <Soft as="span" className="font-display text-sm italic text-terracotta">
            02
          </Soft>
          <Soft as="span" className="text-[10px] uppercase tracking-[0.24em] text-ink/50">
            Signature lash menu
          </Soft>
          <Soft
            as="span"
            className="rounded-full bg-blush px-3 py-1.5 text-[9.5px] uppercase tracking-[0.18em] text-ink"
          >
            New
          </Soft>
        </div>

        <div className="mb-[clamp(30px,5vh,56px)] grid grid-cols-1 items-end gap-[clamp(24px,5vw,72px)] wide:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <h2 className="m-0 font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
            <Rise>Now lashes,</Rise>
            <Rise innerClassName="italic text-plum">mapped to your eyes.</Rise>
          </h2>
          <Soft as="p" className="m-0 max-w-[38ch] text-[14.5px] leading-[1.7] text-ink/65">
            Start with the look you want, then choose how full. Every set is mapped to your eye
            shape before a single extension goes on.
          </Soft>
        </div>

        <div className="grid grid-cols-1 items-start gap-[clamp(24px,4vw,64px)] wide:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Step one — the look */}
          <div>
            <Soft as="p" className="m-0 mb-3.5 text-[10px] uppercase tracking-[0.22em] text-ink/50">
              Step one · the look
            </Soft>

            <div className="grid gap-2.5">
              {LASH_LOOKS.map((l) => {
                const on = l.id === lookId;
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setLookId(l.id)}
                    data-lash-look
                    data-track-id={`lash-look-${l.id}`}
                    className={`relative grid min-h-[56px] w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 overflow-hidden rounded-lg border px-[clamp(15px,2vw,22px)] py-[clamp(15px,2.2vh,21px)] text-left font-body transition-all duration-[350ms] ease-editorial ${
                      on ? "border-plum bg-plum text-bone" : "border-shell-line bg-bone text-ink"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="h-[34px] w-[34px] flex-none rounded-full"
                      style={{ background: l.dot }}
                    />
                    <span>
                      <span className="block font-display text-[clamp(18px,1.9vw,24px)] leading-[1.15] tracking-[-0.01em]">
                        {l.name}
                      </span>
                      <span
                        className={`mt-[3px] block text-[12.5px] leading-[1.5] ${
                          on ? "text-white/[0.72]" : "text-ink/55"
                        }`}
                      >
                        {l.blurb}
                      </span>
                    </span>
                    <span
                      className={`whitespace-nowrap text-[10px] uppercase tracking-[0.16em] ${
                        on ? "text-white/[0.72]" : "text-ink/45"
                      }`}
                    >
                      {l.sets.length} {l.sets.length === 1 ? "set" : "sets"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* The eye map — bar heights are the look's own mapping curve. */}
            <Soft className="mt-4 rounded-lg border border-shell-line bg-bone px-[clamp(16px,2.2vw,24px)] py-[clamp(18px,3vh,26px)]">
              <p className="m-0 text-[10px] uppercase tracking-[0.22em] text-ink/50">The map</p>
              <p
                className="m-0 mt-1.5 font-display text-[clamp(16px,1.8vw,22px)] italic"
                style={{ color: look.accent }}
              >
                {look.where}
              </p>

              <div className="mt-4 flex h-[92px] items-end gap-[5px]">
                {look.map.map((v, i) => (
                  <span
                    key={`${look.id}-${i}`}
                    data-map-bar
                    className="block flex-1 rounded-t-[3px] transition-all duration-[550ms] ease-editorial"
                    style={{
                      height: `${Math.round(v * 100)}%`,
                      background: `color-mix(in srgb, ${look.accent} ${Math.round(38 + v * 62)}%, #F4EEE7)`,
                    }}
                  />
                ))}
              </div>

              <div className="mt-2.5 flex justify-between text-[9.5px] uppercase tracking-[0.18em] text-ink/45">
                <span>Inner</span>
                <span>Centre</span>
                <span>Outer</span>
              </div>

              <p className="m-0 mt-3.5 text-[11.5px] leading-[1.6] text-ink/55">
                Each bar is a lash length along your lash line. Your artist re-measures this on your
                own eye shape before the first extension goes on.
              </p>
            </Soft>
          </div>

          {/* Step two — how full */}
          <div>
            <Soft as="p" className="m-0 mb-3.5 text-[10px] uppercase tracking-[0.22em] text-ink/50">
              Step two · how full
            </Soft>

            <div className="mb-[clamp(24px,4vh,36px)] grid gap-0">
              {look.sets.map((set) => {
                const tier = LASH_TIERS[set.tier];
                // Volume and Russian are the highlighted tiers in the export.
                const on = tier.weight >= 3;
                return (
                  <div
                    key={set.style}
                    data-lash-tier
                    className="relative mb-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(14px,2.4vw,30px)] rounded-lg border px-[clamp(14px,2vw,22px)] py-[clamp(18px,2.8vh,26px)] transition-colors duration-[400ms]"
                    style={{
                      background: on
                        ? "color-mix(in srgb, #56203C 7%, #FFFFFF)"
                        : "#FFFFFF",
                      borderColor: on
                        ? "color-mix(in srgb, #56203C 26%, transparent)"
                        : "rgba(26,22,20,0.14)",
                    }}
                  >
                    <span aria-hidden className="flex h-[18px] items-end gap-[3px]">
                      {tier.bars.map((h, i) => (
                        <span
                          key={`${set.style}-${i}`}
                          className="block w-[3px] rounded-t-[2px]"
                          style={{ height: `${h}px`, background: on ? "#56203C" : "#BF5634" }}
                        />
                      ))}
                    </span>

                    <span>
                      <span className="flex flex-wrap items-baseline gap-2">
                        <span className="font-display text-[clamp(17px,1.9vw,24px)] leading-[1.15] tracking-[-0.01em] text-ink">
                          {set.style}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-ink/45">
                          {tier.name}
                        </span>
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-[1.5] text-ink/55">
                        {set.detail}
                      </span>
                    </span>

                    <span className="text-right">
                      <span className="block whitespace-nowrap font-display text-[clamp(17px,1.9vw,24px)] text-ink">
                        {inr(set.price)}
                      </span>
                      <span className="mt-1 block whitespace-nowrap text-[10px] uppercase tracking-[0.16em] text-ink/45">
                        {duration(tier.minutes)}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {signature.length > 0 && (
              <div className="mb-[clamp(24px,4vh,36px)]">
                <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.22em] text-ink/50">
                  Signature textures · no mapping needed
                </p>
                <div className="flex flex-wrap gap-[9px]">
                  {signature.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-baseline gap-2.5 rounded-full border border-ink/[0.22] px-[17px] py-2.5"
                    >
                      <span className="text-[12.5px] tracking-[0.02em] text-ink">{s.name}</span>
                      <span className="font-display text-[15px] text-ink">{inr(s.price)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-shell-line bg-shell-line">
              {LASH_FACTS.map((f) => (
                <div
                  key={f.value}
                  className="bg-bone px-[clamp(12px,1.6vw,18px)] py-[clamp(16px,2.4vh,22px)]"
                >
                  <p className="m-0 font-display text-[clamp(18px,2.1vw,26px)] leading-none tracking-[-0.02em] text-plum">
                    {f.value}
                  </p>
                  <p className="m-0 mt-[7px] text-[11px] leading-[1.5] text-ink/55">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lift & tint, plus aftercare */}
        <div className="mt-[clamp(34px,5.5vh,60px)] grid grid-cols-1 gap-[clamp(20px,4vw,56px)] border-t border-shell-line pt-[clamp(24px,4vh,38px)] wide:grid-cols-2">
          <Soft>
            <p className="m-0 mb-3.5 text-[10px] uppercase tracking-[0.22em] text-ink/50">
              Lash lift &amp; tint · separate services
            </p>
            <div>
              {extras.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-shell-line py-3.5"
                >
                  <span className="text-[14.5px] text-ink">
                    {e.name} <span className="text-[11.5px] text-ink/45">· {duration(e.minutes)}</span>
                  </span>
                  <span className="whitespace-nowrap font-display text-[clamp(15px,1.6vw,19px)] text-ink">
                    {inr(e.price)}
                  </span>
                </div>
              ))}
            </div>
          </Soft>

          <Soft>
            <p className="m-0 mb-3.5 text-[10px] uppercase tracking-[0.22em] text-ink/50">
              Aftercare, in short
            </p>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {LASH_AFTERCARE.map((a) => (
                <li
                  key={a}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-[13.5px] leading-[1.6] text-ink/[0.72]"
                >
                  <span className="mt-2.5 h-px w-3 bg-terracotta" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Soft>
        </div>
      </div>
    </section>
  );
}
