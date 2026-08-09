import { Soft } from "@/components/motion/reveal";
import { BMN_POINTS, SALON_POINTS } from "@/lib/site";
import SectionLabel from "./section-label";

function Dash({ color }: { color: string }) {
  return <span className="mt-[11px] h-px w-2.5" style={{ background: color }} />;
}

export default function Compare() {
  return (
    <section data-track-section="compare" className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="03" label="The difference" />

        <div className="grid grid-cols-1 gap-[clamp(16px,3vw,40px)] wide:grid-cols-2">
          <Soft className="rounded-md border border-ink/[0.16] p-card-p">
            <p className="m-0 mb-[22px] text-[10px] uppercase tracking-[0.22em] text-ink/45">
              A traditional salon
            </p>
            <ul className="m-0 grid list-none gap-3.5 p-0">
              {SALON_POINTS.map((p) => (
                <li
                  key={p}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-[14.5px] leading-[1.6] text-ink/[0.62]"
                >
                  <Dash color="rgba(26,22,20,0.35)" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Soft>

          <Soft
            className="rounded-md p-card-p text-bone"
            style={{
              background: "linear-gradient(150deg,#56203C 0%,#8A3A3C 55%,#BF5634 100%)",
            }}
          >
            <p className="m-0 mb-[22px] text-[10px] uppercase tracking-[0.22em] opacity-75">
              BookMyNail
            </p>
            <ul className="m-0 grid list-none gap-3.5 p-0">
              {BMN_POINTS.map((p) => (
                <li
                  key={p}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-[14.5px] leading-[1.6]"
                >
                  <Dash color="#E7A79F" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Soft>
        </div>
      </div>
    </section>
  );
}
