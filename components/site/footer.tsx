import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-bone/60">
      <div className="mx-auto flex max-w-shell flex-wrap items-end justify-between gap-5 px-gutter py-[clamp(28px,5vh,46px)]">
        <div>
          <p className="m-0 mb-2 font-display text-2xl text-bone">
            BookMyNail
          </p>
          <p className="m-0 font-display text-sm italic text-bone/70">
            Luxury Nails. Comfort of Home.
          </p>
        </div>

        <div className="flex flex-wrap gap-[22px] text-[10px] uppercase tracking-[0.18em]">
          <span>© 2026 BookMyNail · Ahmedabad</span>
          <Link
            href="/portfolio"
            className="text-inherit no-underline border-b border-transparent transition-colors duration-250 hover:border-blush hover:text-bone"
          >
            Portfolio
          </Link>
          <a
            href="https://instagram.com/bookmynail"
            target="_blank"
            rel="noopener"
            className="text-inherit no-underline border-b border-transparent transition-colors duration-250 hover:border-blush hover:text-bone"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
