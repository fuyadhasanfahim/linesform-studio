/**
 * The only bridge between the site and Google Tag Manager. Nothing is
 * pushed unless the visitor has allowed at least one optional category and
 * the container has been requested for this page view.
 *
 * Events never carry personal data: no names, email addresses or form
 * contents — only the event name and fixed, non-identifying parameters.
 */
import type { ConsentChoice } from "@/lib/consent/store";

type ConsentFlags = Pick<ConsentChoice, "analytics" | "marketing">;

export type TrackedEvent =
  /** One per route, including the first. Use it as the page-view trigger in GTM. */
  | "virtual_page_view"
  /** The enquiry form passed client checks and was submitted. Not a conversion. */
  | "enquiry_submit"
  /** The server confirmed the enquiry was delivered. The only conversion event. */
  | "enquiry_sent"
  /** The server could not deliver the enquiry (not configured, or failed). */
  | "enquiry_not_sent"
  /** A mailto link or a link to the enquiry form was clicked. */
  | "contact_click";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let containerRequested = false;

function dataLayer(): unknown[] {
  window.dataLayer ??= [];
  return window.dataLayer;
}

// GTM only reads consent commands in gtag's `arguments` form, not as arrays.
function gtag(..._args: unknown[]): void;
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  dataLayer().push(arguments);
}

function consentState({ analytics, marketing }: ConsentFlags) {
  const ads = marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

/**
 * Must run before the container script is inserted: sets Consent Mode
 * defaults (every optional type denied) and then applies the visitor's
 * choice, so no tag ever sees an undefined consent state. Idempotent.
 */
export function initialiseConsentSignals(choice: ConsentFlags) {
  if (containerRequested) return;
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  });
  gtag("consent", "update", consentState(choice));
  containerRequested = true;
}

/** Applies a changed choice to a container that is already loaded. */
export function updateConsentSignals(choice: ConsentFlags) {
  if (!containerRequested) return;
  gtag("consent", "update", consentState(choice));
  dataLayer().push({
    event: "consent_update",
    analytics_consent: choice.analytics,
    marketing_consent: choice.marketing,
  });
}

export function isContainerRequested(): boolean {
  return containerRequested;
}

export function track(event: TrackedEvent, params: Params = {}) {
  if (!containerRequested) return;
  dataLayer().push({ event, ...params });
}

/** First-party cookies that GA4, Google Ads and Meta Pixel can set. */
const TRACKING_COOKIE = /^(_ga|_gid|_gat|_gcl_|_gac_|_fbp|_fbc)/;

/** Removes optional first-party tracking cookies after consent is withdrawn. */
export function clearTrackingCookies() {
  const hostParts = window.location.hostname.split(".");
  // Cookies may be scoped to the host or to a parent domain (e.g. .example.com).
  const domains = hostParts.map((_, index) => hostParts.slice(index).join(".")).filter((d) => d.includes(".") || d === "localhost");
  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();
    if (!name || !TRACKING_COOKIE.test(name)) continue;
    const expire = `${name}=; Max-Age=0; path=/`;
    document.cookie = expire;
    for (const domain of domains) document.cookie = `${expire}; domain=.${domain}`;
  }
}
