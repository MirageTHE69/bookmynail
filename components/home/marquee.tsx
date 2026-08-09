import { MARQUEE } from "@/lib/site";

/**
 * Two identical tracks scrolling left forever, matching the export's 26s
 * linear GSAP loop. The animation is CSS so it costs nothing on the main thread.
 */
export default function Marquee() {
  return (
    <div data-track-section="marquee" className="flex overflow-hidden bg-ink py-[15px] text-bone">
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="flex flex-none animate-marquee items-center gap-10 whitespace-nowrap pr-10 font-display text-[19px] italic motion-reduce:animate-none"
        >
          {MARQUEE.map((m) => (
            <span
              key={m.text}
              className={
                m.muted
                  ? "font-body text-[11px] not-italic tracking-[0.3em] opacity-60"
                  : undefined
              }
            >
              {m.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
