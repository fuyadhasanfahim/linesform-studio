import type { MetadataRoute } from "next";
import { absoluteUrl, publishAbsoluteUrls } from "@/content/site";

/**
 * Everything public may be crawled, including the CSS, JavaScript and images
 * crawlers need to render pages. The Sitemap line is omitted when no real
 * origin is configured, so a production build never advertises localhost.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(publishAbsoluteUrls ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
