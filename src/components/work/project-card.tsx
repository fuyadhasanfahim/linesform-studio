import Link from "next/link";
import { ViewTransition } from "react";
import { AssetImage } from "@/components/media/asset-image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Arrow } from "@/components/ui/arrow-link";
import { formatIndex, type Project } from "@/content/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  variant: "landscape" | "portrait";
  sizes: string;
  headingLevel?: "h2" | "h3";
}

export function ProjectCard({ project, index, variant, sizes, headingLevel: Heading = "h3" }: ProjectCardProps) {
  const asset = variant === "portrait" ? project.portraitAsset : project.heroAsset;

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <ViewTransition name={`project-${project.slug}`} share="project-morph" default="none">
        <div>
          <ImageReveal>
            <AssetImage
              id={asset}
              aspect={variant === "portrait" ? "3 / 4" : "3 / 2"}
              sizes={sizes}
              decorative
              imageClassName="media-zoom"
            />
          </ImageReveal>
        </div>
      </ViewTransition>

      <div className="rule mt-5 flex items-start justify-between gap-6 pt-4">
        <div>
          <Heading className="t-h3">
            <span className="link-draw">{project.title}</span>
          </Heading>
          <p className="t-small mt-1.5 text-balance text-olive-ink">
            {project.category}, {project.year}
          </p>
          <p className="t-small text-balance text-olive-ink">{project.location}</p>
        </div>
        <span className="flex shrink-0 items-center gap-3 pt-1">
          <span className="t-numeral text-lg text-olive-ink">{formatIndex(index)}</span>
          <Arrow />
        </span>
      </div>
    </Link>
  );
}
