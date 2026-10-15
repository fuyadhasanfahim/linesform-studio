import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl } from "@/content/site";

/** Date the content was last revised. Update alongside content changes. */
const CONTENT_UPDATED = new Date("2026-10-15");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/work"), lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/privacy"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
