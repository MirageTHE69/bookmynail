import { Rise, Soft, Wipe } from "@/components/motion/reveal";
import { HYGIENE_POINTS, HYGIENE_VIDEO } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Hygiene() {
  return (
    <section id="hygiene" className="relative overflow-hidden bg-ink text-bone">
      <div
        className="absolute inset-0 opacity-25"
        style={{ background: "linear-gradient(145deg, #3F4A52, #9BA5AC)" }}
      />

      <div className="relative mx-auto max-w-shell px-gutter py-section-y">
        <SectionLabel num="05" label="Hygiene, on camera" dark />

        <div className="grid grid-cols-1 items-center gap-[clamp(26px,5vw,72px)] wide:grid-cols-2">
          <Wipe className="aspect-[4/5] max-w-[360px] overflow-hidden rounded-[180px_180px_12px_12px] wide:max-w-none">
            <video
              className="h-full w-full object-cover"
              src={HYGIENE_VIDEO}
              muted
              loop
              autoPlay
              playsInline
              aria-label="Kit unsealing and workstation setup video"
            />
          </Wipe>

          <div>
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,80px)] font-normal leading-[0.96] tracking-[-0.02em] text-bone">
              <span className="block overflow-hidden">
                <Rise>Every kit, opened</Rise>
              </span>
              <span className="block overflow-hidden">
                <Rise innerClassName="italic">in front of you.</Rise>
              </span>
            </h2>

            <Soft as="p" className="m-0 mb-[30px] max-w-[48ch] text-[15.5px] leading-[1.75] text-bone/85">
              Before we touch a single nail, your artist unseals sanitised tools, lays out
              single-use files, and sets up a clean workstation — all where you can see it. Nothing
              pre-opened, nothing shared between clients.
            </Soft>

            <ol className="m-0 grid list-none gap-0 p-0">
              {HYGIENE_POINTS.map((point, i) => (
                <li
                  key={point}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-[18px] border-t border-white/25 py-4 ${
                    i === HYGIENE_POINTS.length - 1 ? "border-b border-white/25" : ""
                  }`}
                >
                  <span className="font-display text-[13px] italic text-blush">
                    0{i + 1}
                  </span>
                  <span className="text-[15px] leading-[1.6] text-bone">
                    {point}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
