import { assertModelId, GEMINI_BASE_URL, geminiRequest, getApiKey, readUsage, redact } from "./gemini-client.ts";
import {
  GenerationError,
  VIDEO_ASPECT_RATIOS,
  VIDEO_RESOLUTIONS,
  type VideoJob,
  type VideoJobStatus,
  type VideoRequest,
} from "./generation-types.ts";

/**
 * Video generation with Gemini Omni through the Interactions API:
 *   POST /v1beta/interactions          (background: true) → interaction id
 *   GET  /v1beta/interactions/{id}     → poll until a terminal status
 *
 * The request and response shapes follow the official @google/genai SDK
 * (v2.30.0) type definitions. This path has not yet been exercised against
 * the live API; the first approved run is also its verification.
 */

const KNOWN_STATUSES: VideoJobStatus[] = ["queued", "in_progress", "completed", "failed", "cancelled", "incomplete"];
const TERMINAL: VideoJobStatus[] = ["completed", "failed", "cancelled", "incomplete"];
const MAX_DURATION_SECONDS = 10;

interface RawInteraction {
  id?: string;
  status?: string;
  output_video?: { data?: string; uri?: string; mime_type?: string };
  steps?: unknown[];
  usage?: Record<string, number | undefined>;
}

export function videoModel(): string {
  return assertModelId(process.env.VIDEO_GEN_MODEL_NAME, "VIDEO_GEN_MODEL_NAME");
}

function validate(request: VideoRequest): void {
  if (!(VIDEO_ASPECT_RATIOS as readonly string[]).includes(request.aspectRatio)) {
    throw new GenerationError("invalid-request", `Unsupported video aspect ratio "${request.aspectRatio}".`);
  }
  if (!(VIDEO_RESOLUTIONS as readonly string[]).includes(request.resolution)) {
    throw new GenerationError("invalid-request", `Unsupported video resolution "${request.resolution}".`);
  }
  if (!Number.isInteger(request.durationSeconds) || request.durationSeconds < 2 || request.durationSeconds > MAX_DURATION_SECONDS) {
    throw new GenerationError("invalid-request", `Duration must be a whole number of seconds from 2 to ${MAX_DURATION_SECONDS}.`);
  }
}

/** Finds the first video block anywhere in the interaction (output_video or within steps). */
function findVideo(value: unknown): { data?: string; uri?: string; mime_type?: string } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  if (record.type === "video" && (typeof record.data === "string" || typeof record.uri === "string")) {
    return record as { data?: string; uri?: string; mime_type?: string };
  }
  for (const child of Object.values(record)) {
    const found = Array.isArray(child) ? child.map(findVideo).find(Boolean) : findVideo(child);
    if (found) return found;
  }
  return undefined;
}

function toJob(raw: RawInteraction): VideoJob {
  if (!raw.id) throw new GenerationError("provider-error", "The Interactions API returned no interaction id.");
  const status = (KNOWN_STATUSES as string[]).includes(raw.status ?? "") ? (raw.status as VideoJobStatus) : "unknown";
  const video = raw.output_video ?? findVideo(raw.steps);
  return {
    id: raw.id,
    status,
    output: video ? { data: video.data, uri: video.uri, mimeType: video.mime_type } : undefined,
    usage: readUsage(raw.usage),
  };
}

/** Starts one paid background generation. Never retried automatically. */
export async function createVideoJob(request: VideoRequest, model = videoModel()): Promise<VideoJob> {
  validate(request);
  const raw = await geminiRequest<RawInteraction>("interactions", {
    method: "POST",
    timeoutMs: 60_000,
    body: {
      model,
      input: request.prompt,
      background: true,
      store: true,
      response_format: {
        type: "video",
        aspect_ratio: request.aspectRatio,
        resolution: request.resolution,
        duration: `${request.durationSeconds}s`,
      },
    },
  });
  return toJob(raw);
}

export async function getVideoJob(id: string): Promise<VideoJob> {
  if (!/^[A-Za-z0-9_-]{4,200}$/.test(id)) throw new GenerationError("invalid-request", "Invalid interaction id.");
  const raw = await geminiRequest<RawInteraction>(`interactions/${encodeURIComponent(id)}`, { timeoutMs: 30_000 });
  return toJob(raw);
}

export function isTerminal(status: VideoJobStatus): boolean {
  return TERMINAL.includes(status);
}

/** Polls with a fixed interval until the job finishes or the wait budget runs out. */
export async function waitForVideoJob(
  id: string,
  { intervalMs = 10_000, maxWaitMs = 15 * 60_000, onUpdate }: { intervalMs?: number; maxWaitMs?: number; onUpdate?: (job: VideoJob) => void } = {},
): Promise<VideoJob> {
  const deadline = Date.now() + maxWaitMs;
  for (;;) {
    const job = await getVideoJob(id);
    onUpdate?.(job);
    if (isTerminal(job.status)) return job;
    if (Date.now() > deadline) {
      throw new GenerationError("timeout", `Video job ${id} still ${job.status} after ${Math.round(maxWaitMs / 60_000)} min; poll again later.`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

/** Returns the finished video bytes, downloading from the URI when the API does not inline them. */
export async function downloadVideo(job: VideoJob): Promise<Buffer> {
  if (job.status !== "completed" || !job.output) {
    throw new GenerationError("no-output", `Video job ${job.id} has no output (status: ${job.status}).`);
  }
  if (job.output.data) return Buffer.from(job.output.data, "base64");
  if (!job.output.uri) throw new GenerationError("no-output", "Video output has neither data nor a URI.");

  const uri = new URL(job.output.uri, GEMINI_BASE_URL);
  if (uri.protocol !== "https:" || !(uri.hostname === "googleapis.com" || uri.hostname.endsWith(".googleapis.com"))) {
    throw new GenerationError("provider-error", "Refusing to send the API key to a non-Google download host.");
  }
  const response = await fetch(uri, {
    headers: { "x-goog-api-key": getApiKey() },
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    throw new GenerationError("provider-error", `Video download failed with HTTP ${response.status}: ${redact(await response.text())}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
