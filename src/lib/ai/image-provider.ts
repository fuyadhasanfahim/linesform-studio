import { assertModelId, geminiRequest, readUsage } from "./gemini-client.ts";
import {
  GenerationError,
  IMAGE_ASPECT_RATIOS,
  IMAGE_SIZES,
  type ImageRequest,
  type ImageResult,
} from "./generation-types.ts";

const PROMPT_LIMITS = { min: 40, max: 4000 };
/** Image generation can take a while; abort rather than hang, and never retry automatically. */
const IMAGE_TIMEOUT_MS = 180_000;

interface GenerateContentResponse {
  candidates?: Array<{
    finishReason?: string;
    content?: { parts?: Array<{ text?: string; inlineData?: { mimeType?: string; data?: string } }> };
  }>;
  promptFeedback?: { blockReason?: string };
  usageMetadata?: Record<string, number | undefined>;
}

export function imageModel(): string {
  return assertModelId(process.env.IMAGE_GEN_MODEL_NAME, "IMAGE_GEN_MODEL_NAME");
}

function validate(request: ImageRequest): void {
  if (!(IMAGE_ASPECT_RATIOS as readonly string[]).includes(request.aspectRatio)) {
    throw new GenerationError("invalid-request", `Unsupported aspect ratio "${request.aspectRatio}".`);
  }
  if (!(IMAGE_SIZES as readonly string[]).includes(request.imageSize)) {
    throw new GenerationError("invalid-request", `Unsupported image size "${request.imageSize}".`);
  }
  const length = request.prompt.trim().length;
  if (length < PROMPT_LIMITS.min || length > PROMPT_LIMITS.max) {
    throw new GenerationError(
      "invalid-request",
      `Prompt must be between ${PROMPT_LIMITS.min} and ${PROMPT_LIMITS.max} characters (got ${length}).`,
    );
  }
}

/**
 * Generates one image with the configured Nano Banana model via
 * `models/{model}:generateContent`, requesting image output only.
 * One call = one paid generation: callers decide when to call; this never retries.
 */
export async function generateImage(request: ImageRequest, model = imageModel()): Promise<ImageResult> {
  validate(request);

  const response = await geminiRequest<GenerateContentResponse>(
    `models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      timeoutMs: IMAGE_TIMEOUT_MS,
      body: {
        contents: [{ role: "user", parts: [{ text: request.prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: request.aspectRatio, imageSize: request.imageSize },
        },
      },
    },
  );

  const usage = readUsage(response.usageMetadata);
  if (response.promptFeedback?.blockReason) {
    throw new GenerationError("blocked", `Prompt was blocked (${response.promptFeedback.blockReason}).`);
  }

  const candidate = response.candidates?.[0];
  const image = candidate?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData;
  if (!image?.data) {
    const reason = candidate?.finishReason ? ` Finish reason: ${candidate.finishReason}.` : "";
    throw new GenerationError("no-output", `The model returned no image.${reason}`);
  }

  return {
    data: Buffer.from(image.data, "base64"),
    mimeType: image.mimeType ?? "image/png",
    model,
    usage,
  };
}
