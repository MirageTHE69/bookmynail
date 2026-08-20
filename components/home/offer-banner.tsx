import Link from "next/link";
import { OFFER_BANNER } from "@/lib/site";

export default function OfferBanner() {
  return (
    <aside
      data-offer
      className="relative overflow-hidden text-bone"
      style={{
        background: "linear-gradient(100deg, #56203C 0%, #8A3A3C 52%, #BF5634 100%)",
      }}
    >
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-center gap-[clamp(10px,2vw,22px)] px-gutter py-3.5 text-center">
        <span className="font-display text-[clamp(15px,1.7vw,20px)] italic">
          {OFFER_BANNER.text}
        </span>
        <Link
          href={OFFER_BANNER.href}
          className="whitespace-nowrap rounded-full border border-white/60 px-4 py-2 text-[10.5px] uppercase tracking-[0.16em] text-bone no-underline transition-colors duration-300 hover:bg-white/15"
        >
          {OFFER_BANNER.cta}
        </Link>
      </div>
    </aside>
  );
}
