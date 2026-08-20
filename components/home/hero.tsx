"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rise, Soft } from "@/components/motion/reveal";
import { useParallax } from "@/components/motion/use-parallax";
import { HERO_SERVICES, HERO_TRUST, HERO_VIDEO } from "@/lib/site";

export default function Hero() {
  const router = useRouter();
  const [service, setService] = useState("gel");
  const [date, setDate] = useState("");
  const [area, setArea] = useState("");

  const videoRef = useParallax<HTMLDivElement>(-6, 6);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (date) params.set("date", date);
    if (area) params.set("area", area);
    const qs = params.toString();
    router.push(`/services${qs ? `?${qs}` : ""}#book`);
  };

  return (
    <section
      data-hero
      data-nav-boundary
      data-track-section="hero"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden"
    >
      {/* Background Video */}
      <div ref={videoRef} className="absolute inset-x-0 -inset-y-[6%] will-change-transform">
        <video
          className="h-full w-full object-cover"
          src={HERO_VIDEO}
          muted
          loop
          autoPlay
          playsInline
          aria-label="Hero background video"
        />
      </div>

      {/* Hero gradient washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, rgba(86,32,60,0.9) 0%, rgba(138,58,60,0.72) 42%, rgba(191,86,52,0.56) 74%, rgba(231,167,159,0.46) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(26,22,20,0.72) 0%, rgba(26,22,20,0.1) 46%, rgba(26,22,20,0.3) 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative mx-auto w-full max-w-shell px-gutter pb-[clamp(26px,4.5vh,44px)] pt-[clamp(104px,15vh,164px)]">
        <div className="mb-[clamp(12px,2vh,18px)] overflow-hidden">
          <Rise hero>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-bone/85">
              At-home nail studio · Ahmedabad
            </span>
          </Rise>
        </div>

        <h1 className="m-0 mb-[clamp(18px,2.8vh,28px)] max-w-[14ch] font-display text-[clamp(44px,8vw,132px)] font-normal leading-[0.88] tracking-[-0.025em] text-bone">
          <span className="block overflow-hidden">
            <Rise hero>Luxury nails,</Rise>
          </span>
          <span className="block overflow-hidden">
            <Rise hero innerClassName="italic">
              at your door.
            </Rise>
          </span>
        </h1>

        {/* Trust points bar */}
        <Soft
          hero
          className="mb-[clamp(18px,3vh,28px)] flex flex-wrap items-center gap-[clamp(12px,2vw,26px)] text-[11.5px] uppercase tracking-[0.14em] text-bone/85"
        >
          {HERO_TRUST.map((item, i) => (
            <span key={item} className="flex items-center gap-[clamp(12px,2vw,26px)]">
              {item}
              {i < HERO_TRUST.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-blush"
                />
              )}
            </span>
          ))}
        </Soft>

        {/* Service price chips */}
        <Soft hero className="mb-[clamp(14px,2.2vh,20px)] flex flex-wrap gap-[9px]">
          {HERO_SERVICES.map((s) => (
            <a
              key={s.id}
              href={`/services?service=${s.id}#book`}
              className="flex min-h-[44px] flex-none items-baseline gap-2.5 rounded-full border border-white/35 bg-[#1A1614]/[0.26] px-[18px] py-[11px] text-bone no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/[0.18]"
            >
              <span className="text-[12.5px] tracking-[0.01em]">{s.name}</span>
              <span className="font-display text-[15px]">₹{s.price.toLocaleString("en-IN")}</span>
              <span className="text-[9.5px] uppercase tracking-[0.16em] opacity-60">
                {s.duration}
              </span>
            </a>
          ))}
        </Soft>

        {/* Hero quick booking bar */}
        <div className="grid grid-cols-1 items-end">
          <Soft
            hero
            className="rounded-xl bg-[#F7F2EC]/95 p-[clamp(13px,1.8vh,17px)] shadow-[0_24px_60px_rgba(26,22,20,0.32)]"
          >
            <div className="grid grid-cols-1 items-end gap-[11px] wide:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
              <label className="grid gap-[7px]">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Service
                </span>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="min-h-[50px] w-full rounded-[7px] border border-ink/20 bg-transparent px-3.5 py-[13px] font-body text-[14.5px] text-ink"
                >
                  {HERO_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-[7px]">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="min-h-[50px] w-full rounded-[7px] border border-ink/20 bg-transparent px-3.5 py-[13px] font-body text-[14.5px] text-ink"
                />
              </label>

              <label className="grid gap-[7px]">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Your area
                </span>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Satellite"
                  className="min-h-[50px] w-full rounded-[7px] border border-ink/20 bg-transparent px-3.5 py-[13px] font-body text-[14.5px] text-ink placeholder:text-ink/35"
                />
              </label>

              <button
                type="button"
                onClick={handleContinue}
                className="flex min-h-[50px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full border-none bg-plum px-[clamp(20px,2.4vw,30px)] text-xs uppercase tracking-[0.14em] text-bone no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(86,32,60,0.4)]"
              >
                Continue to booking
              </button>
            </div>
          </Soft>
        </div>
      </div>
    </section>
  );
}
