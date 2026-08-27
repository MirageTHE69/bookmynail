import Image from "next/image";
import { Rise, Soft, Wipe } from "@/components/motion/reveal";

export default function ServicesHero() {
  return (
    <section
      data-nav-boundary
      data-track-section="services-hero"
      className="relative flex min-h-[82vh] items-stretch overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(150deg,#43305E 0%,#7B62A8 38%,#BF5634 76%,#E7A79F 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 78% at 6% 94%, rgba(0,0,0,0.36), transparent 62%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-shell grid-cols-1 items-end gap-grid px-gutter pb-hero-bottom pt-hero-top wide:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <Rise hero className="mb-[clamp(14px,2.4vh,22px)]">
            <span className="text-[11px] uppercase tracking-[0.3em] text-bone/[0.82]">
              Services &amp; booking · Ahmedabad
            </span>
          </Rise>

          <h1 className="m-0 mb-[clamp(20px,3.4vh,34px)] font-display text-hero-svc font-normal leading-[0.9] tracking-[-0.02em] text-bone">
            <Rise hero>Nails and lashes.</Rise>
            <Rise hero innerClassName="italic">
              We come to you.
            </Rise>
          </h1>

          <Soft
            hero
            className="max-w-[580px] border-t border-bone/30 pt-[clamp(18px,2.6vh,26px)]"
          >
            <p className="m-0 mb-[22px] text-[15.5px] leading-[1.7] text-bone/90">
              Four nail services, fifteen lash sets, a full add-on menu, and a booking form that
              shows your total as you build it. Travel anywhere in Ahmedabad is included.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="#book"
                className="rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(26,22,20,0.24)]"
              >
                Book an appointment
              </a>
              <a
                href="#menu"
                className="rounded-full border border-bone/50 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-[3px] hover:bg-bone/[0.14]"
              >
                See the menu
              </a>
            </div>
          </Soft>
        </div>

        <Wipe
          hero
          className="relative order-first h-[40vh] min-h-[240px] self-end overflow-hidden rounded-[170px_170px_14px_14px] wide:order-none wide:h-[min(62vh,560px)]"
        >
          <Image
            src="/images/services-hero.webp"
            alt="Artist working at a client's home"
            fill
            sizes="(max-width: 1000px) 100vw, 45vw"
            className="object-cover"
            priority
          />
        </Wipe>
      </div>
    </section>
  );
}
