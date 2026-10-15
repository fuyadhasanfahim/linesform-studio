/**
 * Shared types for the asset-generation provider layer.
 *
 * These modules run only in Node (the generation scripts). They are never
 * imported by pages or components, and the site exposes no generation
 * endpoint, so paid requests cannot be triggered by visitors.
 *
 * Written without enums or parameter properties so Node can run the scripts
 * directly with its built-in TypeScript type stripping.
 */

export const IMAGE_ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"] as const;
export const IMAGE_SIZES = ["1K", "2K", "4K"] as const;

export type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number];
export type ImageSize = (typeof IMAGE_SIZES)[number];

export interface ImageRequest {
  prompt: string;
  aspectRatio: ImageAspectRatio;
  imageSize: ImageSize;
}

export interface TokenUsage {
  promptTokens?: number;
  outputTokens?: number;
  thoughtsTokens?: number;
  totalTokens?: number;
}

export interface ImageResult {
  data: Buffer;
  mimeType: string;
  model: string;
  usage: TokenUsage;
}

export const VIDEO_ASPECT_RATIOS = ["16:9", "9:16"] as const;
export const VIDEO_RESOLUTIONS = ["720p", "1080p"] as const;

export interface VideoRequest {
  prompt: string;
  aspectRatio: (typeof VIDEO_ASPECT_RATIOS)[number];
  resolution: (typeof VIDEO_RESOLUTIONS)[number];
  durationSeconds: number;
}

export type VideoJobStatus = "queued" | "in_progress" | "completed" | "failed" | "cancelled" | "incomplete" | "unknown";

export interface VideoJob {
  id: string;
  status: VideoJobStatus;
  /** Present once completed: base64 data or a URI to download with the API key. */
  output?: { data?: string; uri?: string; mimeType?: string };
  usage: TokenUsage;
}

export type GenerationErrorCode =
  | "missing-credentials"
  | "invalid-model"
  | "invalid-request"
  | "provider-error"
  | "quota"
  | "timeout"
  | "blocked"
  | "no-output";

/** Errors carry a stable code and a message that never contains secrets. */
export class GenerationError extends Error {
  readonly code: GenerationErrorCode;
  readonly status?: number;

  constructor(code: GenerationErrorCode, message: string, status?: number) {
    super(message);
    this.name = "GenerationError";
    this.code = code;
    this.status = status;
  }
}
