import { Reveal, RevealItem } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { testimonials } from "@/content/studio";
import { cn } from "@/lib/cn";

/**
 * Client feedback, presented editorially. Every statement is illustrative
 * concept copy and is labelled as such where it appears.
 */
export function Testimonials() {
  const [featured, ...rest] = testimonials.items;

  return (
    <section aria-labelledby="perspectives-heading" className="bg-limestone">
      <div className="shell section-space">
        <div className="grid-page items-end gap-y-6">
          <Reveal className="col-span-12 lg:col-span-6">
            <SectionLabel>{testimonials.label}</SectionLabel>
            <h2 id="perspectives-heading" className="t-h2 mt-6 max-w-[14ch]">
              {testimonials.heading}
            </h2>
          </Reveal>
          <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8" delay={0.1}>
            <p className="measure text-olive-ink">{testimonials.intro}</p>
          </Reveal>
        </div>

        <Reveal className="grid-page mt-[var(--space-block)]">
          <figure className="col-span-12 lg:col-span-10 lg:col-start-2">
            <blockquote>
              <p className="t-quote">“{featured.quote}”</p>
            </blockquote>
            <figcaption className="t-label mt-7 text-olive-ink">
              {testimonials.attributionPrefix} · {featured.context}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal group className="mt-[var(--space-block)]">
          <ul className="grid-page gap-y-10">
            {rest.map((item, index) => (
              <RevealItem
                key={item.context}
                as="li"
                className={cn("rule col-span-12 pt-6 md:col-span-6 lg:col-span-4", index === 0 ? "lg:col-start-2" : "lg:col-start-8")}
              >
                <figure>
                  <blockquote>
                    <p className="t-h3 font-normal">“{item.quote}”</p>
                  </blockquote>
                  <figcaption className="t-label mt-5 text-olive-ink">
                    {testimonials.attributionPrefix} · {item.context}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
