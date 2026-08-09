import { Soft } from "@/components/motion/reveal";

/**
 * The numbered eyebrow that opens every section ("01 — The motto").
 * `dark` switches to the palette used on ink backgrounds.
 */
export default function SectionLabel({
  num,
  label,
  dark,
}: {
  num: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-head-gap flex items-baseline gap-4">
      <Soft
        as="span"
        className={`font-display text-sm italic ${dark ? "text-blush" : "text-terracotta"}`}
      >
        {num}
      </Soft>
      <Soft
        as="span"
        className={`text-[10px] uppercase tracking-[0.24em] ${
          dark ? "text-bone/55" : "text-ink/50"
        }`}
      >
        {label}
      </Soft>
    </div>
  );
}
