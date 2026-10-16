import { AssetImage } from "@/components/media/asset-image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { materials } from "@/content/studio";
import { cn } from "@/lib/cn";

export function Materials() {
  return (
    <section aria-labelledby="materials-heading" className="bg-limestone-deep">
      <div className="shell section-space">
        <div className="grid-page items-end gap-y-6">
          <Reveal className="col-span-12 lg:col-span-7">
            <SectionLabel>{materials.label}</SectionLabel>
            <h2 id="materials-heading" className="t-h2 mt-6 max-w-[15ch]">
              {materials.heading}
            </h2>
          </Reveal>
          <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="measure text-olive-ink">{materials.intro}</p>
          </Reveal>
        </div>

        <ul className="grid-page mt-[var(--space-block)] gap-y-12">
          {materials.items.map((item, index) => (
            <li
              key={item.name}
              className={cn(
                "col-span-6 lg:col-span-3",
                index % 2 === 1 && "mt-14 lg:mt-24",
              )}
            >
              <ImageReveal tone="deep">
                <AssetImage
                  id={item.asset}
                  aspect="4 / 5"
                  sizes="(min-width: 108rem) 25rem, (min-width: 64rem) 23vw, 48vw"
                />
              </ImageReveal>
              <h3 className="t-h3 mt-5">{item.name}</h3>
              <p className="t-small mt-2 max-w-[28ch] text-olive-ink">{item.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
