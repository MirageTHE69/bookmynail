import Link from "next/link";
import { Rise, Soft } from "@/components/motion/reveal";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden text-bone"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(150deg, #56203C 0%, #8A3A3C 46%, #BF5634 78%, #E7A79F 100%)",
        }}
      />

      <div className="relative mx-auto max-w-shell px-gutter py-section-y">
        <h2 className="m-0 mb-[clamp(30px,5vh,52px)] font-display text-display1 font-normal leading-[0.92] tracking-[-0.025em] text-bone">
          <span className="block overflow-hidden">
            <Rise>Book your slot</Rise>
          </span>
          <span className="block overflow-hidden">
            <Rise innerClassName="italic">right here.</Rise>
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-[clamp(22px,4vw,48px)] border-t border-white/35 pt-[clamp(24px,4vh,38px)] nav:grid-cols-3">
          <Soft>
            <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.2em] opacity-75">
              Service area
            </p>
            <p className="m-0 text-[15px] leading-[1.8]">
              Ahmedabad and nearby areas
              <br />
              Travel included in every price
            </p>
          </Soft>

          <Soft>
            <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.2em] opacity-75">
              Appointment hours
            </p>
            <p className="m-0 text-[15px] leading-[1.8]">
              Every day, 9:00 AM – 9:00 PM
              <br />
              Same-day slots when available
            </p>
          </Soft>

          <Soft>
            <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.2em] opacity-75">
              Get in touch
            </p>
            <p className="m-0 mb-[18px] max-w-[32ch] text-[15px] leading-[1.8]">
              Pick your service, date and time in the booking form. You&apos;ll see the full price
              before you confirm.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/services#book"
                className="inline-block rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(26,22,20,0.24)]"
              >
                Book an appointment
              </Link>
              <a
                href="https://instagram.com/bookmynail"
                target="_blank"
                rel="noopener"
                className="inline-block rounded-full border border-white/55 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-[3px] hover:bg-white/15"
              >
                Instagram
              </a>
            </div>
          </Soft>
        </div>
      </div>
    </section>
  );
}
