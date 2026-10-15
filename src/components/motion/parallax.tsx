"use client";

import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { RICH_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Maximum travel as a percentage of the element height. Keep it small. */
  distance?: number;
}

/**
 * Subtle vertical drift tied to scroll position. Runs on motion values, so
 * scrolling never re-renders React. Disabled on touch devices, small screens
 * and for reduced motion, where it would only cost battery and smoothness.
 */
export function Parallax({ children, className, distance = 6 }: ParallaxProps) {
  const enabled = useMediaQuery(RICH_MOTION_QUERY);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div
        className="h-full w-full"
        style={enabled ? { y, scale: 1 + (distance * 2.4) / 100 } : undefined}
      >
        {children}
      </m.div>
    </div>
  );
}
