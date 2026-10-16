export interface NavItem {
  label: string;
  href: string;
}

export interface FooterGroup {
  heading: string;
  links: NavItem[];
}

/**
 * The canonical origin comes from SITE_URL, or on Vercel from the project's
 * production domain. Nothing is invented: when neither is available the
 * site runs on a localhost origin and `siteUrlConfigured` is false.
 */
function resolveSiteUrl(): { url: string; configured: boolean } {
  const explicit = process.env.SITE_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate = explicit || (vercel ? `https://${vercel}` : "");
  if (candidate) {
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return { url: url.href.replace(/\/$/, ""), configured: true };
      }
    } catch {
      // Fall through to the warning below.
    }
    console.warn(`[site] SITE_URL "${candidate}" is not an absolute http(s) URL and was ignored.`);
  }
  return { url: `http://localhost:${process.env.PORT ?? 3000}`, configured: false };
}

const resolved = resolveSiteUrl();

/** True when a real origin is configured (SITE_URL or the Vercel production domain). */
export const siteUrlConfigured = resolved.configured;

/**
 * Whether absolute URLs may be published in sitemap.xml, robots.txt,
 * canonical tags and structured data. Development may use localhost;
 * a production build never publishes a localhost URL.
 */
export const publishAbsoluteUrls = siteUrlConfigured || process.env.NODE_ENV !== "production";

export const site = {
  name: "Linesform Studio",
  url: resolved.url,
  locale: "en_GB",
  title: "Linesform Studio — Architecture & Interiors",
  description:
    "Linesform Studio is a conceptual architecture and interior design practice: calm, material-led houses, interiors and public rooms shaped by light, proportion and context.",
  creator: "Midline Seven",
  creatorUrl: "https://midlineseven.com",
  /** Rendered only when explicitly configured. Never invent contact details. */
  contactEmail: process.env.CONTACT_EMAIL?.trim() || undefined,
  disclosure:
    "Linesform Studio is a fictional architecture and interior design practice, created by Midline Seven as a portfolio concept. All projects, locations and images are conceptual.",
  nav: [
    { label: "Selected work", href: "/work" },
    { label: "Studio", href: "/#studio" },
    { label: "Approach", href: "/#approach" },
  ] satisfies NavItem[],
  /** The one conversion action. The same label is used everywhere it appears. */
  primaryCta: { label: "Start a project", href: "/#contact" } satisfies NavItem,
  footer: [
    {
      heading: "Studio",
      links: [
        { label: "Selected work", href: "/work" },
        { label: "Studio", href: "/#studio" },
        { label: "Approach", href: "/#approach" },
      ],
    },
    {
      heading: "Enquiries",
      links: [
        { label: "Start a project", href: "/#contact" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Cookie policy", href: "/cookies" },
        { label: "Terms & conditions", href: "/terms" },
      ],
    },
    {
      heading: "Information",
      links: [
        { label: "Questions & answers", href: "/#faq" },
        { label: "Accessibility statement", href: "/accessibility" },
        { label: "Security", href: "/security" },
      ],
    },
  ] satisfies FooterGroup[],
} as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Canonical and Open Graph URL fields for a route. Omitted in a production
 * build without a configured origin: no canonical is better than a wrong one.
 */
export function pageUrls(path: string) {
  return publishAbsoluteUrls
    ? { alternates: { canonical: path }, openGraphUrl: { url: path } }
    : { alternates: {}, openGraphUrl: {} };
}
