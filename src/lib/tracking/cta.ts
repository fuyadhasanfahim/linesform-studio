/**
 * Marks a link as a call to action so a click can be measured as
 * `cta_click` (only after consent; see tracking/data-layer.ts). The id says
 * what the action is, the location where on the site it was offered.
 * Neither carries anything about the visitor.
 */
export interface CtaTag {
  id: "start_project" | "see_work" | "read_project";
  location: string;
}

export function ctaAttributes(tag?: CtaTag) {
  return tag ? { "data-cta-id": tag.id, "data-cta-location": tag.location } : {};
}
