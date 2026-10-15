import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { AssetImage } from "@/components/media/asset-image";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { NextProject } from "@/components/project/next-project";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionLabel } from "@/components/ui/section-label";
import { formatIndex, getNextProject, getProject, getProjectIndex, projects } from "@/content/projects";
import { absoluteUrl, site } from "@/content/site";
import { JsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const description = `${project.summary} A conceptual ${project.category.toLowerCase()} by ${site.name}.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${project.title} — ${site.name}`,
      description,
    },
    twitter: { title: `${project.title} — ${site.name}`, description },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = getProjectIndex(project.slug);
  const next = getNextProject(project.slug);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Selected work", item: absoluteUrl("/work") },
            { "@type": "ListItem", position: 3, name: project.title, item: absoluteUrl(`/work/${project.slug}`) },
          ],
        }}
      />

      <header className="shell pt-[clamp(2rem,1rem+4vw,5rem)]">
        <ArrowLink href="/work" direction="back" className="border-transparent">
          Selected work
        </ArrowLink>

        <div className="grid-page mt-[clamp(2rem,1rem+4vw,4.5rem)] gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <SectionLabel index={`${formatIndex(index)} / ${formatIndex(projects.length - 1)}`}>
              Concept study
            </SectionLabel>
            <h1 className="t-h1 mt-6">{project.title}</h1>
          </div>
          <p className="t-lead col-span-12 measure self-end lg:col-span-5 lg:col-start-8">{project.intro}</p>
        </div>

        <dl className="grid-page mt-[clamp(2.5rem,1.5rem+3vw,4rem)] gap-y-6">
          {project.facts.map((fact) => (
            <div key={fact.label} className="rule col-span-6 pt-3 lg:col-span-3">
              <dt className="t-label text-olive-ink">{fact.label}</dt>
              <dd className="mt-1.5 text-[0.9375rem]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure className="shell mt-[clamp(2.5rem,1.5rem+3vw,4.5rem)]">
        <ViewTransition name={`project-${project.slug}`} share="project-morph" default="none">
          <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9]">
            <AssetImage
              id={project.heroAsset}
              aspect="fill"
              preload
              sizes="(min-width: 108rem) 101rem, 94vw"
            />
          </div>
        </ViewTransition>
        <figcaption className="t-small mt-3 flex gap-4 text-olive-ink">
          <span className="t-label shrink-0 pt-[0.2em] text-[0.6875rem]">Fig. 01</span>
          <span>
            {project.title} — {project.summary}
          </span>
        </figcaption>
      </figure>

      <section aria-labelledby="concept-heading" className="shell section-space">
        <div className="grid-page gap-y-10">
          <Reveal className="col-span-12 lg:col-span-5">
            <SectionLabel>Concept</SectionLabel>
            <h2 id="concept-heading" className="t-h2 mt-6 max-w-[14ch]">
              {project.concept.heading}
            </h2>
          </Reveal>
          <Reveal className="t-lead col-span-12 space-y-5 measure-wide lg:col-span-6 lg:col-start-7 lg:pt-12" delay={0.1}>
            {project.concept.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <ProjectGallery items={project.gallery} title={project.title} />

      <section aria-label="Design intent" className="bg-limestone-deep">
        <Reveal className="shell grid-page py-[var(--space-block)]">
          <blockquote className="col-span-12 lg:col-span-9 lg:col-start-2">
            <p className="t-quote">“{project.quote}”</p>
          </blockquote>
        </Reveal>
      </section>

      <section aria-labelledby="detail-heading" className="shell section-space">
        <div className="grid-page gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <SectionLabel>Material &amp; spatial detail</SectionLabel>
            <h2 id="detail-heading" className="t-h2 mt-6 max-w-[12ch]">
              How it is made
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-5">
            <h3 className="t-label text-olive-ink">Materials</h3>
            <Reveal group>
              <dl className="mt-5">
                {project.materials.map((material) => (
                  <RevealItem key={material.name} className="rule py-4">
                    <dt className="t-h3">{material.name}</dt>
                    <dd className="t-small mt-1 text-olive-ink">{material.note}</dd>
                  </RevealItem>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="t-label text-olive-ink">Spatial notes</h3>
            <Reveal group>
              <ul className="mt-5">
                {project.spatialNotes.map((note) => (
                  <RevealItem key={note.title} as="li" className="rule py-4">
                    <p className="font-semibold">{note.title}</p>
                    <p className="t-small mt-1 text-olive-ink">{note.body}</p>
                  </RevealItem>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="t-lead">{project.closing}</p>
            <p className="t-small mt-6 text-olive-ink">
              {project.title} is a conceptual project. The site, client and images are fictional and
              were created for this portfolio.
            </p>
          </Reveal>
        </div>
      </section>

      <NextProject project={next} />

      <section aria-labelledby="project-cta" className="shell section-space">
        <div className="grid-page gap-y-8">
          <h2 id="project-cta" className="t-h2 col-span-12 max-w-[16ch] lg:col-span-7">
            Have a site, a room or a building in mind?
          </h2>
          <div className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
            <p className="measure text-olive-ink">
              Every project starts with a conversation about place, use and ambition.
            </p>
            <ArrowLink href="/#contact" className="mt-6">
              Start an enquiry
            </ArrowLink>
          </div>
        </div>
      </section>
    </article>
  );
}
