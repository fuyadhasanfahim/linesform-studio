import type { Metadata } from "next";
import { AssetImage } from "@/components/media/asset-image";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionLabel } from "@/components/ui/section-label";
import { ProjectIndex, type ProjectRow } from "@/components/work/project-index";
import { formatIndex, projects } from "@/content/projects";
import { site } from "@/content/site";
import { RICH_MOTION_QUERY } from "@/lib/media-queries";

export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Four conceptual projects by Linesform Studio: a courtyard house, an apartment renovation, a boutique hotel interior and a public reading pavilion.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: `Selected work — ${site.name}` },
};

export default function WorkPage() {
  const rows: ProjectRow[] = projects.map((project, index) => ({
    slug: project.slug,
    index: formatIndex(index),
    title: project.title,
    category: project.category,
    location: project.location,
    year: project.year,
  }));

  const previews = Object.fromEntries(
    projects.map((project) => [
      project.slug,
      <AssetImage key={project.slug} id={project.heroAsset} aspect="3 / 2" sizes="22rem" decorative />,
    ]),
  );

  // Thumbnails are hidden where the floating preview is used (the `rich`
  // variant). There the first one, loaded eagerly as the LCP image on other
  // devices, resolves to the smallest file instead of a full-width one.
  const thumbnails = Object.fromEntries(
    projects.map((project, index) => [
      project.slug,
      <AssetImage
        key={project.slug}
        id={project.heroAsset}
        aspect="3 / 2"
        sizes={`${RICH_MOTION_QUERY} 1px, (min-width: 40rem) 50vw, 100vw`}
        eager={index === 0}
        decorative
      />,
    ]),
  );

  return (
    <>
      <section aria-labelledby="work-heading" className="shell pt-[clamp(2.5rem,1rem+6vw,7rem)]">
        <div className="grid-page items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <SectionLabel index={String(projects.length).padStart(2, "0")}>Projects</SectionLabel>
            <h1 id="work-heading" className="t-h1 mt-6">
              Selected work
            </h1>
          </div>
          <p className="col-span-12 measure text-olive-ink lg:col-span-4 lg:col-start-9">
            Conceptual commissions for houses, interiors and a small public building. Every project,
            site and image here is a design study by a fictional practice.
          </p>
        </div>
      </section>

      <section aria-label="Project index" className="shell pt-[var(--space-block)] pb-[var(--space-section)]">
        <ProjectIndex rows={rows} previews={previews} thumbnails={thumbnails} />

        <Reveal className="grid-page mt-[var(--space-block)]">
          <div className="col-span-12 md:col-span-7 lg:col-span-5 lg:col-start-8">
            <p className="t-h3 font-normal">Considering a project of your own?</p>
            <ArrowLink href="/#contact" className="mt-6">
              Start an enquiry
            </ArrowLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
