export interface NavItem {
  label: string;
  href: string;
}

const siteUrl = (process.env.SITE_URL ?? "https://linesformstudio.com").replace(
  /\/$/,
  "",
);

export const site = {
  name: "Linesform Studio",
  url: siteUrl,
  locale: "en_GB",
  title: "Linesform Studio — Architecture & Interiors",
  description:
    "Linesform Studio is a conceptual architecture and interior design practice: calm, material-led houses, interiors and public rooms shaped by light, proportion and context.",
  creator: "Midline Seven",
  /** Rendered only when explicitly configured. Never invent contact details. */
  contactEmail: process.env.CONTACT_EMAIL?.trim() || undefined,
  disclosure:
    "Linesform Studio is a fictional architecture and interior design practice, created by Midline Seven as a portfolio concept. All projects, locations and images are conceptual.",
  nav: [
    { label: "Selected work", href: "/work" },
    { label: "Studio", href: "/#studio" },
    { label: "Approach", href: "/#approach" },
    { label: "Contact", href: "/#contact" },
  ] satisfies NavItem[],
} as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
