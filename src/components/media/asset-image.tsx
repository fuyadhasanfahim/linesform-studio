import Image from "next/image";
import { cssAspect, getAsset, isAvailable } from "@/content/assets";
import { cn } from "@/lib/cn";
import { AssetPlaceholder } from "./asset-placeholder";

interface AssetImageProps {
  id: string;
  /** Responsive `sizes` for the rendered slot. Required to avoid oversized downloads. */
  sizes: string;
  /**
   * CSS aspect ratio for this placement, e.g. "4 / 5". Defaults to the asset's
   * ratio. Use "fill" when the parent sets a (responsive) size.
   */
  aspect?: string;
  /** Preload in <head>. Use only for the LCP image of a page. */
  preload?: boolean;
  /** Empty alt text, for images inside links whose text already names the target. */
  decorative?: boolean;
  className?: string;
  imageClassName?: string;
}

/**
 * Renders a manifest asset in a box with a fixed aspect ratio, so layout is
 * stable before and after the image loads, and before it is generated.
 */
export function AssetImage({
  id,
  sizes,
  aspect,
  preload = false,
  decorative = false,
  className,
  imageClassName,
}: AssetImageProps) {
  const asset = getAsset(id);
  const fill = aspect === "fill";

  return (
    <div
      className={cn("relative overflow-hidden bg-limestone-deep", fill && "h-full w-full", className)}
      style={fill ? undefined : { aspectRatio: aspect ?? cssAspect(asset.aspectRatio) }}
    >
      {isAvailable(asset) ? (
        <Image
          src={asset.file}
          alt={decorative ? "" : asset.alt}
          fill
          sizes={sizes}
          preload={preload}
          quality={80}
          placeholder={asset.blurDataURL ? "blur" : "empty"}
          blurDataURL={asset.blurDataURL}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <AssetPlaceholder asset={asset} decorative={decorative} />
      )}
    </div>
  );
}
