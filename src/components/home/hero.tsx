import Link from "next/link";
import type { CSSProperties } from "react";
import { AssetImage } from "@/components/media/asset-image";
import { Parallax } from "@/components/motion/parallax";
import { ArrowLink, ButtonLink } from "@/components/ui/arrow-link";
import { site } from "@/content/site";
import { hero } from "@/content/studio";

/**
 * Entrance motion here is CSS-only (see .mask-line / .fade-in in globals.css)
 * so it starts with first paint, needs no hydration and never hides content
 * when JavaScript is unavailable.
 *
 * The first screen answers three questions on every viewport: what the studio
 * designs (headline + statement), how it differs (from the site inward) and
 * what to do next (one primary action, one secondary).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="shell pt-[clamp(2.25rem,1rem+5vw,6rem)]">
      <div className="grid-page gap-y-8">
        <p className="t-label fade-in col-span-12 text-olive-ink" style={{ "--delay": "0ms" } as CSSProperties}>
          {hero.label}
        </p>
        <h1 id="hero-heading" className="t-display col-span-12 lg:col-span-8">
          <span className="mask-line" style={{ "--line": 0 } as CSSProperties}>
            <span>Houses and</span>
          </span>{" "}
          <span className="mask-line" style={{ "--line": 1 } as CSSProperties}>
            <span>interiors, drawn</span>
          </span>{" "}
          <span className="mask-line" style={{ "--line": 2 } as CSSProperties}>
            <span>
              from the <em className="italic">site</em>.
            </span>
          </span>
        </h1>
        <div
          className="fade-in col-span-12 self-end sm:col-span-10 md:col-span-8 lg:col-span-4 lg:pb-[0.45em]"
          style={{ "--delay": "420ms" } as CSSProperties}
        >
          <p className="t-lead measure">{hero.statement}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href={site.primaryCta.href} cta={{ id: "start_project", location: "hero" }}>
              {site.primaryCta.label}
            </ButtonLink>
            <ArrowLink href="/work" cta={{ id: "see_work", location: "hero" }}>
              See the work
            </ArrowLink>
          </div>
        </div>
      </div>

      <div className="grid-page mt-[clamp(2.75rem,1.5rem+4vw,5.5rem)] gap-y-10">
        <div
          className="fade-in col-span-3 hidden flex-col justify-end pb-[3.25rem] lg:flex"
          style={{ "--delay": "650ms" } as CSSProperties}
        >
          <p className="t-label text-olive-ink">Practice</p>
          <ul className="rule mt-4 pt-3 text-[0.9375rem]">
            {hero.typologies.map((typology) => (
              <li key={typology} className="py-1">
                {typology}
              </li>
            ))}
          </ul>
        </div>

        <figure className="col-span-12 lg:col-span-9">
          <Parallax className="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/9]" distance={4}>
            <div className="settle-in h-full w-full">
              <AssetImage
                id={hero.figureAsset}
                aspect="fill"
                preload
                sizes="(min-width: 108rem) 76rem, (min-width: 64rem) 72vw, 100vw"
              />
            </div>
          </Parallax>
          <figcaption className="t-small mt-3 flex items-baseline justify-between gap-6 text-olive-ink">
            <span className="t-label shrink-0">Fig. 01</span>
            <Link href={`/work/${hero.figureProject}`} className="link-draw text-right">
              {hero.figureCaption}
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
