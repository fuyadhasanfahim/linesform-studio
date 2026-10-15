import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getAsset, isAvailable } from "@/content/assets";

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "assets/fonts");
const fonts = [
  {
    name: "Cormorant",
    data: readFileSync(join(fontDir, "CormorantGaramond-Medium.ttf")),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Manrope",
    data: readFileSync(join(fontDir, "Manrope-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
];

const PHOTO = { width: 560, height: 630 };

/**
 * Embeds the photograph as a crop sized for the card (tens of KB) rather
 * than the multi-megabyte original, or returns null while it is pending.
 * Cached so the card stays a static, build-time asset.
 */
async function photoDataUrl(assetId: string): Promise<string | null> {
  "use cache";
  cacheLife("max"); // Source files only change with a deploy.
  const asset = getAsset(assetId);
  if (!isAvailable(asset)) return null;
  const crop = await sharp(join(process.cwd(), "public", asset.file))
    .resize(PHOTO.width, PHOTO.height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${crop.toString("base64")}`;
}

interface OgCardProps {
  eyebrow: string;
  title: string;
  footnote: string;
  assetId: string;
}

/** Shared social card: brand typography on limestone, photograph to the right. */
export async function renderOgCard({ eyebrow, title, footnote, assetId }: OgCardProps) {
  const photo = await photoDataUrl(assetId);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f3f0e9" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 640,
            padding: "64px 56px 56px 64px",
            color: "#252722",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Manrope", fontSize: 18, letterSpacing: 3.5, color: "#5c6154" }}>
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: 88, lineHeight: 0.98, letterSpacing: -1.5 }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              borderTop: "1px solid rgba(37,39,34,0.25)",
              paddingTop: 20,
              fontFamily: "Manrope",
              fontSize: 18,
              color: "#5c6154",
            }}
          >
            {footnote}
          </div>
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- rendered by ImageResponse, not the DOM
          <img src={photo} alt="" width={PHOTO.width} height={PHOTO.height} style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", width: 560, height: 630, background: "#252722", position: "relative" }}>
            <div style={{ position: "absolute", left: 200, top: 150, width: 2, height: 330, background: "#f3f0e9" }} />
            <div style={{ position: "absolute", left: 200, top: 478, width: 200, height: 2, background: "#f3f0e9" }} />
            <div style={{ position: "absolute", left: 280, top: 150, width: 2, height: 250, background: "#b7a58b" }} />
            <div style={{ position: "absolute", left: 280, top: 398, width: 120, height: 2, background: "#b7a58b" }} />
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts },
  );
}
