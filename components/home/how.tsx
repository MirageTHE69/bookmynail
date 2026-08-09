import { Rise } from "@/components/motion/reveal";
import Steps from "@/components/site/steps";
import { HOME_STEPS } from "@/lib/site";
import SectionLabel from "./section-label";

export default function How() {
  return (
    <section id="how" data-track-section="how" className="bg-bone py-section-y">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionLabel num="06" label="How it works" />

        <h2 className="m-0 mb-block-gap max-w-[16ch] font-display text-display3 font-normal leading-[0.95] tracking-[-0.02em]">
          <Rise>Four steps from</Rise>
          <Rise innerClassName="italic text-terracotta">message to manicure.</Rise>
        </h2>

        <Steps steps={HOME_STEPS} />
      </div>
    </section>
  );
}
