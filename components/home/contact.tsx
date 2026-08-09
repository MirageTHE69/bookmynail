"use client";

import { Rise, Soft } from "@/components/motion/reveal";
import { useSettings, useWhatsappUrl } from "@/components/site/settings-provider";

export default function Contact() {
  const { instagram, serviceArea, hours } = useSettings();
  const bookUrl = useWhatsappUrl();
  return (
    <section id="contact" data-track-section="contact" className="relative overflow-hidden text-bone">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(150deg,#56203C 0%,#8A3A3C 46%,#BF5634 78%,#E7A79F 100%)",
        }}
      />
      <div className="relative mx-auto max-w-shell px-gutter py-section-y">
        <h2 className="m-0 mb-[clamp(30px,5vh,52px)] font-display text-display1 font-normal leading-[0.92] tracking-[-0.025em]">
          <Rise>Book your slot</Rise>
          <Rise innerClassName="italic">in one message.</Rise>
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[clamp(22px,4vw,48px)] border-t border-bone/[0.36] pt-[clamp(24px,4vh,38px)]">
          <Soft>
            <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.2em] opacity-75">
              Service area
            </p>
            <p className="m-0 whitespace-pre-line text-[15px] leading-[1.8]">{serviceArea}</p>
          </Soft>

          <Soft>
            <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.2em] opacity-75">
              Appointment hours
            </p>
            <p className="m-0 whitespace-pre-line text-[15px] leading-[1.8]">{hours}</p>
          </Soft>

          <Soft>
            <p className="m-0 mb-2.5 text-[10px] uppercase tracking-[0.2em] opacity-75">
              Get in touch
            </p>
            <p className="m-0 mb-[18px] max-w-[32ch] text-[15px] leading-[1.8]">
              Tell us the service, your area and a date. We reply with a slot and the final price.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={bookUrl}
                data-track-id="contact-whatsapp"
                target="_blank"
                rel="noopener"
                className="rounded-full bg-bone px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-ink no-underline transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(26,22,20,0.24)]"
              >
                WhatsApp us
              </a>
              <a
                href={instagram}
                data-track-id="contact-instagram"
                target="_blank"
                rel="noopener"
                className="rounded-full border border-bone/55 px-[26px] py-[15px] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-[3px] hover:bg-bone/[0.14]"
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
