import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { renderOgCard } from "@/lib/og-card";

export const alt = "A conceptual project by Linesform Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderOgCard({
    eyebrow: `Linesform Studio · ${project.category}`,
    title: project.title,
    footnote: `${project.location} · ${project.year}`,
    assetId: project.heroAsset,
  });
}
