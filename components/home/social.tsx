import Image from "next/image";
import { Rise } from "@/components/motion/reveal";
import { INSTAGRAM_POSTS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function Social() {
  return (
    <section id="social" data-section-light className="bg-bone pb-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="11" label="Follow along" />

        <div className="mb-[clamp(24px,4vh,40px)] grid grid-cols-1 items-end gap-[clamp(20px,4vw,56px)] nav:grid-cols-[minmax(0,1fr)_auto]">
          <h2 className="m-0 max-w-[22ch] font-display text-[clamp(28px,4.6vw,72px)] font-normal leading-[0.98] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden">
              <Rise>More sets, more often,</Rise>
            </span>
            <span className="block overflow-hidden">
              <Rise innerClassName="italic">on Instagram.</Rise>
            </span>
          </h2>

          <a
            href="https://instagram.com/bookmynail"
            target="_blank"
            rel="noopener"
            className="inline-block whitespace-nowrap rounded-full border border-ink/40 px-6 py-3.5 text-[11px] uppercase tracking-[0.16em] text-ink no-underline transition-colors duration-300 hover:bg-ink hover:text-bone"
          >
            @bookmynail
          </a>
        </div>

        <div className="grid grid-cols-2 gap-[clamp(8px,1.2vw,14px)] nav:grid-cols-3 wide:grid-cols-6">
          {INSTAGRAM_POSTS.map((post, i) => (
            <a
              key={i}
              href={post.href}
              target="_blank"
              rel="noopener"
              className="group relative aspect-square overflow-hidden rounded-[10px] bg-ink/5"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(max-width: 760px) 50vw, (max-width: 1000px) 33vw, 16vw"
                className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.08]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
