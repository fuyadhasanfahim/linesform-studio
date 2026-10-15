import Link from "next/link";
import { AssetImage } from "@/components/media/asset-image";
import { Arrow } from "@/components/ui/arrow-link";
import type { Project } from "@/content/projects";

export function NextProject({ project }: { project: Project }) {
  return (
    <section aria-label="Next project" className="bg-charcoal text-limestone">
      <Link
        href={`/work/${project.slug}`}
        className="group shell grid-page items-end gap-y-10 py-[var(--space-block)]"
      >
        <div className="col-span-12 md:col-span-7">
          <p className="t-label text-stone">Next project</p>
          <p className="t-h1 mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="link-draw">{project.title}</span>
            <span className="inline-flex scale-150 text-stone">
              <Arrow />
            </span>
          </p>
          <p className="t-small mt-4 text-stone">
            {project.category} · {project.location}
          </p>
        </div>
        <div className="col-span-8 sm:col-span-6 md:col-span-4 md:col-start-9">
          <div className="overflow-hidden">
            <AssetImage
              id={project.heroAsset}
              aspect="3 / 2"
              sizes="(min-width: 48rem) 30vw, 66vw"
              decorative
              imageClassName="media-zoom"
            />
          </div>
        </div>
      </Link>
    </section>
  );
}
