import { AssetImage } from "@/components/media/asset-image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { getAsset, type AspectRatio } from "@/content/assets";
import type { GalleryItem } from "@/content/projects";
import { cn } from "@/lib/cn";

type Orientation = "landscape" | "portrait" | "square";

function orientationOf(ratio: AspectRatio): Orientation {
  const [w, h] = ratio.split(":").map(Number);
  if (w === h) return "square";
  return w > h ? "landscape" : "portrait";
}

/** Column placement per orientation, alternating sides to keep the sequence moving. */
const placement: Record<Orientation, { left: string; right: string; sizes: string }> = {
  landscape: {
    left: "col-span-12 lg:col-span-8",
    right: "col-span-12 lg:col-span-8 lg:col-start-5",
    sizes: "(min-width: 108rem) 70rem, (min-width: 64rem) 66vw, 100vw",
  },
  portrait: {
    left: "col-span-10 sm:col-span-7 lg:col-span-5 lg:col-start-2",
    right: "col-span-10 col-start-3 sm:col-span-7 sm:col-start-6 lg:col-span-5 lg:col-start-7",
    sizes: "(min-width: 108rem) 44rem, (min-width: 64rem) 40vw, (min-width: 40rem) 58vw, 84vw",
  },
  square: {
    left: "col-span-9 sm:col-span-6 lg:col-span-4 lg:col-start-3",
    right: "col-span-9 col-start-4 sm:col-span-6 sm:col-start-7 lg:col-span-4 lg:col-start-8",
    sizes: "(min-width: 108rem) 35rem, (min-width: 64rem) 32vw, (min-width: 40rem) 50vw, 75vw",
  },
};

export function ProjectGallery({ items, title }: { items: GalleryItem[]; title: string }) {
  return (
    <section aria-label={`${title} — gallery`} className="shell section-space pt-0">
      <ul className="grid-page gap-y-[clamp(3.5rem,2rem+5vw,8rem)]">
        {items.map((item, index) => {
          const slot = placement[orientationOf(getAsset(item.asset).aspectRatio)];
          return (
            <li key={item.asset} className={cn(index % 2 === 0 ? slot.left : slot.right)}>
              <figure>
                <ImageReveal>
                  <AssetImage id={item.asset} sizes={slot.sizes} />
                </ImageReveal>
                <figcaption className="t-small mt-3 flex gap-4 text-olive-ink">
                  <span className="t-label shrink-0 pt-[0.2em] text-[0.6875rem]">
                    Fig. {String(index + 2).padStart(2, "0")}
                  </span>
                  <span>{item.caption}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
