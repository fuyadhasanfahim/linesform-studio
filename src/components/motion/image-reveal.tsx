"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE_ARCHITECTURAL, revealViewport } from "./variants";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  /** Colour of the panel that withdraws to reveal the image — match the section background. */
  tone?: "light" | "deep" | "dark";
}

/**
 * A mask reveal built only from transforms: a panel in the section colour
 * withdraws upward while the image settles from a slight scale.
 * Skipped entirely for reduced motion, and hidden by the <noscript> rule.
 */
export function ImageReveal({ children, className, tone = "light" }: ImageRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn("relative overflow-hidden", className)}>{children}</div>;
  }

  return (
    <m.div
      className={cn("relative overflow-hidden", className)}
      initial="hidden"
      whileInView="shown"
      viewport={revealViewport}
    >
      <m.div
        variants={{ hidden: { scale: 1.08 }, shown: { scale: 1 } }}
        transition={{ duration: 1.5, ease: EASE_ARCHITECTURAL }}
      >
        {children}
      </m.div>
      <m.div
        aria-hidden="true"
        data-reveal-cover=""
        className={cn(
          "pointer-events-none absolute inset-0 origin-top",
          tone === "dark" && "bg-charcoal",
          tone === "deep" && "bg-limestone-deep",
          tone === "light" && "bg-limestone",
        )}
        variants={{ hidden: { scaleY: 1 }, shown: { scaleY: 0 } }}
        transition={{ duration: 1.1, ease: EASE_ARCHITECTURAL }}
      />
    </m.div>
  );
}
