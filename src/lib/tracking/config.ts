/**
 * Tag configuration. `NEXT_PUBLIC_GTM_ID` is inlined at build time, so this
 * module gives the same answer on the server and in the browser.
 *
 * Only Google Tag Manager is configured in the application. GA4, Google Ads,
 * Meta Pixel and any other tags are added inside the GTM container itself
 * (see docs/analytics-and-seo.md).
 */
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]{4,12}$/;

const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim().toUpperCase() ?? "";

if (rawGtmId && !GTM_ID_PATTERN.test(rawGtmId)) {
  console.warn(`[tracking] NEXT_PUBLIC_GTM_ID "${rawGtmId}" is not a GTM container ID (GTM-XXXXXXX). Tag Manager is disabled.`);
}

/** The GTM container ID, or null when it is missing or malformed. */
export const gtmId: string | null = GTM_ID_PATTERN.test(rawGtmId) ? rawGtmId : null;

/**
 * Optional (non-essential) cookies can only be set by tags loaded through
 * GTM. Without a container there is nothing to ask consent for, so no
 * banner is shown and no preferences control is offered.
 */
export const hasOptionalTracking = gtmId !== null;
