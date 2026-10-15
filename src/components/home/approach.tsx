import { Reveal, RevealItem } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { approach } from "@/content/studio";

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-heading" className="bg-charcoal text-limestone">
      <div className="shell section-space grid-page gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <Reveal className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
            <SectionLabel index="03" tone="dark">
              {approach.label}
            </SectionLabel>
            <h2 id="approach-heading" className="t-h2 mt-6 max-w-[12ch]">
              {approach.heading}
            </h2>
            <p className="mt-6 measure text-stone">{approach.intro}</p>
          </Reveal>
        </div>

        <Reveal group className="col-span-12 lg:col-span-7 lg:col-start-6">
          <ol>
            {approach.steps.map((step, index) => (
              <RevealItem
                key={step.title}
                as="li"
                className="rule-inverse grid grid-cols-[3.25rem_1fr] gap-x-5 py-9 sm:grid-cols-[6rem_1fr] sm:gap-x-8 sm:py-12"
              >
                <span
                  aria-hidden="true"
                  className="t-numeral text-[clamp(2.5rem,1.9rem+2.6vw,4.75rem)] leading-[0.82] text-stone"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="t-h3">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 measure-wide text-limestone/80">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
