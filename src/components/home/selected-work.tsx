import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionLabel } from "@/components/ui/section-label";
import { ProjectCard } from "@/components/work/project-card";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

/**
 * An asymmetric editorial arrangement: two landscape and two portrait
 * placements of different widths and vertical offsets, so no two cards
 * read as repeats of the same template.
 */
const layout = [
  {
    variant: "landscape",
    className: "col-span-12 lg:col-span-8",
    sizes: "(min-width: 108rem) 68rem, (min-width: 64rem) 64vw, 100vw",
  },
  {
    variant: "portrait",
    className:
      "col-span-10 col-start-3 sm:col-span-7 sm:col-start-6 lg:col-span-4 lg:col-start-9 lg:mt-[clamp(8rem,14vw,16rem)]",
    sizes: "(min-width: 64rem) 30vw, (min-width: 40rem) 56vw, 82vw",
  },
  {
    variant: "portrait",
    className: "col-span-10 sm:col-span-7 lg:col-span-4 lg:col-start-2",
    sizes: "(min-width: 64rem) 30vw, (min-width: 40rem) 56vw, 82vw",
  },
  {
    variant: "landscape",
    className: "col-span-12 lg:col-span-6 lg:col-start-7 lg:mt-[clamp(6rem,10vw,12rem)]",
    sizes: "(min-width: 108rem) 52rem, (min-width: 64rem) 48vw, 100vw",
  },
] as const;

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="shell section-space">
      <div className="grid-page items-end gap-y-8">
        <Reveal className="col-span-12 lg:col-span-7">
          <SectionLabel index="01">Selected work</SectionLabel>
          <h2 id="work-heading" className="t-h2 mt-6 max-w-[14ch]">
            Four studies in mass, light and material.
          </h2>
        </Reveal>
        <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9" delay={0.1}>
          <p className="measure text-olive-ink">
            Each project begins with a site and a way of living. These conceptual commissions
            explore how restrained architecture can hold everyday life with care.
          </p>
          <ArrowLink href="/work" className="mt-6">
            Index of projects
          </ArrowLink>
        </Reveal>
      </div>

      <ul className="grid-page mt-[var(--space-block)] gap-y-[clamp(4rem,2.5rem+5vw,7.5rem)]">
        {projects.map((project, index) => {
          const slot = layout[index % layout.length];
          return (
            <li key={project.slug} className={cn(slot.className)}>
              <ProjectCard
                project={project}
                index={index}
                variant={slot.variant}
                sizes={slot.sizes}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
