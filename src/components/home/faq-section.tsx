import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionLabel } from "@/components/ui/section-label";
import { faq } from "@/content/studio";

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="shell section-space pb-0">
      <div className="grid-page gap-y-10">
        <Reveal className="col-span-12 lg:col-span-4">
          <SectionLabel>{faq.label}</SectionLabel>
          <h2 id="faq-heading" className="t-h2 mt-6 max-w-[12ch]">
            {faq.heading}
          </h2>
          <p className="mt-6 measure text-olive-ink">{faq.intro}</p>
          <ArrowLink href="#enquiry" className="mt-8">
            Go to the enquiry form
          </ArrowLink>
        </Reveal>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Accordion items={faq.items} />
        </div>
      </div>
    </section>
  );
}
