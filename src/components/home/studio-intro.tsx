import { AssetImage } from "@/components/media/asset-image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { studio } from "@/content/studio";

export function StudioIntro() {
  return (
    <section id="studio" aria-labelledby="studio-heading" className="shell section-space">
      <div className="grid-page gap-y-12">
        <figure className="col-span-12 sm:col-span-8 md:col-span-5">
          <ImageReveal>
            <AssetImage
              id={studio.asset}
              aspect="3 / 4"
              sizes="(min-width: 108rem) 42rem, (min-width: 48rem) 40vw, (min-width: 40rem) 66vw, 100vw"
            />
          </ImageReveal>
          <figcaption className="t-small mt-3 text-olive-ink">{studio.assetCaption}</figcaption>
        </figure>

        <div className="col-span-12 md:col-span-7 md:col-start-6 md:pl-[calc(var(--gutter)*1.5)] lg:col-span-6 lg:col-start-7 lg:pt-[8%] lg:pl-0">
          <Reveal>
            <SectionLabel index="02">{studio.label}</SectionLabel>
            <h2 id="studio-heading" className="t-h2 mt-6 max-w-[16ch]">
              {studio.heading}
            </h2>
            <div className="t-lead mt-8 space-y-5 measure-wide">
              {studio.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal group className="mt-14">
            <dl className="grid gap-x-[var(--gutter)] sm:grid-cols-2">
              {studio.principles.map((principle) => (
                <RevealItem key={principle.title} className="rule pt-4 pb-8">
                  <dt className="t-h3">{principle.title}</dt>
                  <dd className="t-small mt-2 text-olive-ink">{principle.body}</dd>
                </RevealItem>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
