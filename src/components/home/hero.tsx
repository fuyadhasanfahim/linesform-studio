import Link from "next/link";
import type { CSSProperties } from "react";
import { AssetImage } from "@/components/media/asset-image";
import { Parallax } from "@/components/motion/parallax";
import { ArrowLink } from "@/components/ui/arrow-link";
import { hero } from "@/content/studio";

/**
 * Entrance motion here is CSS-only (see .mask-line / .fade-in in globals.css)
 * so it starts with first paint, needs no hydration and never hides content
 * when JavaScript is unavailable.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="shell pt-[clamp(2.25rem,1rem+5vw,6rem)]">
      <div className="grid-page">
        <p className="t-label fade-in col-span-12 text-olive-ink" style={{ "--delay": "0ms" } as CSSProperties}>
          {hero.label}
        </p>
        <h1 id="hero-heading" className="t-display col-span-12 mt-5 lg:col-span-9">
          <span className="mask-line" style={{ "--line": 0 } as CSSProperties}>
            <span>Architecture</span>
          </span>
          <span className="mask-line" style={{ "--line": 1 } as CSSProperties}>
            <span>
              drawn from <em className="italic">light</em>
            </span>
          </span>
          <span className="mask-line" style={{ "--line": 2 } as CSSProperties}>
            <span>and material.</span>
          </span>
        </h1>
        <div
          className="fade-in col-span-3 hidden self-end pb-[0.6em] lg:block"
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
      </div>

      <div className="grid-page mt-[clamp(2.25rem,1.25rem+4vw,5rem)] gap-y-10">
        <div
          className="fade-in col-span-12 flex flex-col justify-end md:col-span-4 lg:col-span-3"
          style={{ "--delay": "420ms" } as CSSProperties}
        >
          <p className="t-lead measure">{hero.statement}</p>
          <ArrowLink href="/work" className="mt-8 self-start">
            View selected work
          </ArrowLink>
        </div>

        <figure className="col-span-12 md:col-span-8 lg:col-span-9">
          <Parallax className="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/9]" distance={4}>
            <div className="settle-in h-full w-full">
              <AssetImage
                id={hero.figureAsset}
                aspect="fill"
                preload
                sizes="(min-width: 108rem) 76rem, (min-width: 64rem) 72vw, (min-width: 48rem) 64vw, 100vw"
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
