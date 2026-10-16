"use client";

import { useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { Arrow } from "@/components/ui/arrow-link";
import { cn } from "@/lib/cn";
import { RICH_MOTION_QUERY } from "@/lib/media-queries";
import { useMediaQuery } from "@/lib/use-media-query";

export interface ProjectRow {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number;
}

interface ProjectIndexProps {
  rows: ProjectRow[];
  /** Server-rendered images keyed by slug, used for the floating preview. */
  previews: Record<string, ReactNode>;
  /** Server-rendered inline thumbnails keyed by slug, for touch and reduced motion. */
  thumbnails: Record<string, ReactNode>;
}

const PREVIEW_WIDTH = 352;

/**
 * Project list with a preview that follows the pointer. The pointer position
 * lives in motion values, so moving the mouse never re-renders React; state
 * changes only when the hovered row changes. Keyboard focus shows the same
 * preview beside the focused row.
 */
export function ProjectIndex({ rows, previews, thumbnails }: ProjectIndexProps) {
  const rich = useMediaQuery(RICH_MOTION_QUERY);
  const [active, setActive] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 32, mass: 0.6 });

  function handlePointerMove(event: PointerEvent<HTMLUListElement>) {
    x.set(event.clientX + 32);
    y.set(event.clientY - (PREVIEW_WIDTH * 2) / 3 / 2);
  }

  function handleFocus(event: FocusEvent<HTMLAnchorElement>, slug: string) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.jump(rect.right - PREVIEW_WIDTH - 120);
    y.jump(rect.top + rect.height / 2 - (PREVIEW_WIDTH * 2) / 3 / 2);
    setActive(slug);
  }

  return (
    <>
      <ul
        onPointerMove={rich ? handlePointerMove : undefined}
        onPointerLeave={() => setActive(null)}
        className="border-b border-[var(--line)]"
      >
        {rows.map((row) => (
          <li key={row.slug} className="rule">
            <Link
              href={`/work/${row.slug}`}
              onPointerEnter={() => setActive(row.slug)}
              onFocus={(event) => handleFocus(event, row.slug)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-12 items-baseline gap-x-[var(--gutter)] gap-y-3 py-7 sm:py-9"
            >
              <span className="col-span-12 lg:col-span-7">
                <span
                  className={cn(
                    "block font-display text-[clamp(2.4rem,1.5rem+3.3vw,4.75rem)] leading-[1] tracking-[-0.02em]",
                    "transition-[color,transform] duration-500 ease-architectural",
                    "rich:group-hover:translate-x-3",
                    active && active !== row.slug && "rich:text-olive",
                  )}
                >
                  {row.title}
                </span>
              </span>
              <span className="col-span-12 sm:col-span-6 lg:col-span-3">
                <span className="block font-medium">{row.category}</span>
                <span className="t-small block text-olive-ink">{row.location}</span>
              </span>
              <span className="col-span-12 flex items-center justify-between gap-4 sm:col-span-6 lg:col-span-2">
                <span className="tabular-nums text-olive-ink">{row.year}</span>
                <Arrow />
              </span>
              <span className="col-span-12 mt-3 rich:hidden sm:col-span-6">
                {thumbnails[row.slug]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {rich ? (
        <m.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-30 overflow-hidden"
          style={{ x: springX, y: springY, width: PREVIEW_WIDTH }}
          initial={false}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.94 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {rows.map((row) => (
            <div
              key={row.slug}
              className={cn(
                "transition-opacity duration-300",
                row.slug === active ? "relative opacity-100" : "absolute inset-0 opacity-0",
              )}
            >
              {previews[row.slug]}
            </div>
          ))}
        </m.div>
      ) : null}
    </>
  );
}
