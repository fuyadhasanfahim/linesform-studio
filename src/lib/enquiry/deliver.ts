import type { EnquiryValues } from "./schema";

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "failed" };

const TIMEOUT_MS = 10_000;

function webhookUrl(): URL | null {
  const raw = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    // Personal data must not travel in clear text outside local development.
    if (url.protocol === "https:" || (url.protocol === "http:" && isLocal)) return url;
    console.error("[enquiry] ENQUIRY_WEBHOOK_URL must use https.");
    return null;
  } catch {
    console.error("[enquiry] ENQUIRY_WEBHOOK_URL is not a valid URL.");
    return null;
  }
}

/**
 * Delivers an enquiry by POSTing JSON to ENQUIRY_WEBHOOK_URL, optionally with
 * `Authorization: Bearer ${ENQUIRY_WEBHOOK_SECRET}`. Delivery counts as
 * successful only when the endpoint answers with a 2xx status.
 *
 * Message contents are never logged.
 */
export async function deliverEnquiry(values: EnquiryValues): Promise<DeliveryResult> {
  const url = webhookUrl();
  if (!url) return { ok: false, reason: "not-configured" };

  const headers: Record<string, string> = { "content-type": "application/json" };
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET?.trim();
  if (secret) headers.authorization = `Bearer ${secret}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type: "project-enquiry",
        source: "linesformstudio.com",
        submittedAt: new Date().toISOString(),
        ...values,
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`[enquiry] Delivery endpoint responded with HTTP ${response.status}.`);
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (error) {
    const kind = error instanceof Error ? error.name : "UnknownError";
    console.error(`[enquiry] Delivery request failed (${kind}).`);
    return { ok: false, reason: "failed" };
  }
}
