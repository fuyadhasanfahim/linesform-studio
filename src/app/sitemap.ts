import type { MetadataRoute } from "next";
import { LEGAL_PAGES } from "@/components/legal/legal-document";
import { projects } from "@/content/projects";
import { absoluteUrl, publishAbsoluteUrls } from "@/content/site";

/** Date the content was last revised. Update alongside content changes. */
const CONTENT_UPDATED = new Date("2026-10-16");

/**
 * Every public, indexable route — and only routes that exist. Studio,
 * Approach, Contact and Questions are sections of the homepage (/#studio
 * etc.), so they are covered by "/" rather than listed as fragment URLs.
 *
 * A production build without a configured origin returns an empty sitemap
 * rather than publishing localhost URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!publishAbsoluteUrls) {
    console.warn(
      "[site] SITE_URL is not set: this build publishes an empty sitemap.xml, no Sitemap line in robots.txt " +
        "and no canonical URLs. Set SITE_URL to the production origin before deploying (see .env.example).",
    );
    return [];
  }
  return [
    { url: absoluteUrl("/"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/work"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...LEGAL_PAGES.map((page) => ({
      url: absoluteUrl(page.href),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
