import { OPEN_SETTINGS_EVENT } from "./events";

/**
 * The visitor's choice about optional cookies, kept in localStorage.
 * Storing the choice is itself essential: without it the question would be
 * asked on every page. Nothing here is sent to a server.
 */

export interface ConsentChoice {
  version: typeof CONSENT_VERSION;
  /** Measurement (for example Google Analytics 4). */
  analytics: boolean;
  /** Advertising and conversion measurement (for example Google Ads, Meta Pixel). */
  marketing: boolean;
  savedAt: string;
}

/** Bump when the categories or their meaning change, so visitors are asked again. */
export const CONSENT_VERSION = 1;
const STORAGE_KEY = "linesform-consent";
/** A choice is remembered for twelve months, then asked again. */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

type Listener = () => void;
const listeners = new Set<Listener>();
let current: ConsentChoice | null = null;
let loaded = false;

function isChoice(value: unknown): value is ConsentChoice {
  if (!value || typeof value !== "object") return false;
  const choice = value as Record<string, unknown>;
  return (
    choice.version === CONSENT_VERSION &&
    typeof choice.analytics === "boolean" &&
    typeof choice.marketing === "boolean" &&
    typeof choice.savedAt === "string"
  );
}

function readStored(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isChoice(parsed)) return null;
    const age = Date.now() - Date.parse(parsed.savedAt);
    return Number.isFinite(age) && age >= 0 && age < MAX_AGE_MS ? parsed : null;
  } catch {
    // Storage can be unavailable (private modes, blocked site data): ask again.
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

/** Current choice, or null when none is stored (or it expired). Client only. */
export function getConsent(): ConsentChoice | null {
  if (!loaded) {
    current = readStored();
    loaded = true;
  }
  return current;
}

/** Server snapshot: the choice is unknown until the browser has read storage. */
export function getServerConsent(): undefined {
  return undefined;
}

export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  // Keep several open tabs in step.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = readStored();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveConsent(choice: Pick<ConsentChoice, "analytics" | "marketing">): ConsentChoice {
  current = {
    version: CONSENT_VERSION,
    analytics: choice.analytics,
    marketing: choice.marketing,
    savedAt: new Date().toISOString(),
  };
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // The choice still applies to this page view.
  }
  emit();
  return current;
}

export function onOpenCookieSettings(handler: () => void): () => void {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
}
