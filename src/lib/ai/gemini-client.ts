import { GenerationError, type TokenUsage } from "./generation-types.ts";

/**
 * Minimal client for the Gemini API REST endpoints (v1beta), authenticated
 * with the `x-goog-api-key` header so the key never appears in a URL.
 * Endpoint reference: https://ai.google.dev/api
 */
export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new GenerationError(
      "missing-credentials",
      "GEMINI_API_KEY is not set. Add it to .env.local (git-ignored) or the deployment environment.",
    );
  }
  return key;
}

/** Removes anything that looks like a credential before text is logged or thrown. */
export function redact(text: string): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  let safe = key ? text.split(key).join("[redacted]") : text;
  safe = safe.replace(/AIza[0-9A-Za-z_-]{20,}/g, "[redacted]").replace(/AQ\.[0-9A-Za-z_-]{20,}/g, "[redacted]");
  return safe.length > 600 ? `${safe.slice(0, 600)}…` : safe;
}

/** Model IDs are path segments: allow only the characters real IDs use. */
export function assertModelId(model: string | undefined, envName: string): string {
  const id = model?.trim();
  if (!id) throw new GenerationError("invalid-model", `${envName} is not set.`);
  if (!/^[a-z0-9][a-z0-9.-]{1,80}$/i.test(id)) {
    throw new GenerationError("invalid-model", `${envName} contains an invalid model ID.`);
  }
  return id;
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  timeoutMs: number;
}

export async function geminiRequest<T>(path: string, { method = "GET", body, timeoutMs }: RequestOptions): Promise<T> {
  const key = getApiKey();
  let response: Response;
  try {
    response = await fetch(`${GEMINI_BASE_URL}/${path}`, {
      method,
      headers: { "x-goog-api-key": key, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new GenerationError("timeout", `Gemini API request timed out after ${Math.round(timeoutMs / 1000)}s.`);
    }
    throw new GenerationError("provider-error", `Gemini API request failed: ${redact(String(error))}`);
  }

  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      message = (JSON.parse(text) as { error?: { message?: string } }).error?.message ?? text;
    } catch {
      // Non-JSON error body; keep the raw (redacted) text.
    }
    const code = response.status === 404 ? "invalid-model" : response.status === 400 ? "invalid-request" : "provider-error";
    throw new GenerationError(code, `Gemini API ${response.status}: ${redact(message)}`, response.status);
  }
  return JSON.parse(text) as T;
}

interface ModelInfo {
  name: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
}

/** Free metadata call: confirms a model ID exists and supports generateContent. */
export async function verifyModel(model: string): Promise<ModelInfo> {
  const info = await geminiRequest<ModelInfo>(`models/${encodeURIComponent(model)}`, { timeoutMs: 20_000 });
  if (!info.supportedGenerationMethods?.includes("generateContent")) {
    throw new GenerationError("invalid-model", `Model "${model}" does not support generateContent.`);
  }
  return info;
}

export function readUsage(raw: Record<string, number | undefined> | undefined): TokenUsage {
  return {
    promptTokens: raw?.promptTokenCount ?? raw?.total_input_tokens,
    outputTokens: raw?.candidatesTokenCount ?? raw?.total_output_tokens,
    thoughtsTokens: raw?.thoughtsTokenCount ?? raw?.total_thought_tokens,
    totalTokens: raw?.totalTokenCount ?? raw?.total_tokens,
  };
}
