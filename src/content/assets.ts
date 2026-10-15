import manifest from "./asset-manifest.json";

export type AssetStatus = "planned" | "generated" | "failed";
export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface AssetGeneration {
  model: string;
  generatedAt: string;
  promptSent: string;
  sourceMimeType?: string;
  usage?: { promptTokens?: number; outputTokens?: number; thoughtsTokens?: number; totalTokens?: number };
  /** Computed from the API's reported token usage at Standard-tier list prices. */
  costUsdFromUsage?: number;
}

export interface AssetRecord {
  id: string;
  file: string;
  section: string;
  purpose: string;
  alt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  batch: number;
  prompt: string;
  status: AssetStatus;
  estimatedCostUsd: number;
  width?: number;
  height?: number;
  blurDataURL?: string;
  generation?: AssetGeneration;
  error?: string;
}

const records = manifest.assets as AssetRecord[];
const byId = new Map(records.map((asset) => [asset.id, asset]));

export function getAsset(id: string): AssetRecord {
  const asset = byId.get(id);
  if (!asset) {
    throw new Error(`Unknown asset "${id}". Add it to src/content/asset-manifest.json.`);
  }
  return asset;
}

export function isAvailable(asset: AssetRecord): boolean {
  return asset.status === "generated" && Boolean(asset.width && asset.height);
}

/** "3:2" → "3 / 2" for the CSS aspect-ratio property. */
export function cssAspect(ratio: AspectRatio): string {
  return ratio.replace(":", " / ");
}
