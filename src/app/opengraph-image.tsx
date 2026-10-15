import { renderOgCard } from "@/lib/og-card";

export const alt = "Linesform Studio — architecture and interiors shaped by light, material and purpose.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    eyebrow: "Linesform Studio",
    title: "Architecture drawn from light and material.",
    footnote: "Architecture & interiors · A portfolio concept",
    assetId: "hero-courtyard-dusk",
  });
}
