import type { AssetRecord } from "@/content/assets";

/**
 * Stand-in for an image that has not been generated yet. It is clearly
 * labelled so a placeholder can never be mistaken for final artwork.
 */
export function AssetPlaceholder({ asset, decorative = false }: { asset: AssetRecord; decorative?: boolean }) {
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${asset.alt} (image pending)`}
      aria-hidden={decorative ? true : undefined}
      className="placeholder-surface absolute inset-0 flex items-center justify-center text-olive"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 320 200"
        className="h-auto w-3/5 max-w-[22rem] opacity-70"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      >
        <line x1="0" y1="168" x2="320" y2="168" />
        <rect x="46" y="92" width="196" height="76" />
        <line x1="34" y1="92" x2="262" y2="92" />
        <rect x="70" y="118" width="38" height="50" />
        <rect x="132" y="108" width="84" height="34" />
        <line x1="242" y1="128" x2="292" y2="128" />
        <line x1="292" y1="128" x2="292" y2="168" />
        <circle cx="268" cy="108" r="14" />
        <line x1="268" y1="122" x2="268" y2="168" />
      </svg>
      <span className="t-label absolute bottom-3 left-3 bg-limestone/85 px-2 py-1 text-[0.625rem] text-olive-ink">
        Image pending · {asset.id}
      </span>
    </div>
  );
}
