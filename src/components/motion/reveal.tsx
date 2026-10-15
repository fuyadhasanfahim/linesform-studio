"use client";

import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { fadeRise, revealTransition, revealViewport, stagger } from "./variants";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Stagger direct <RevealItem> children instead of revealing as one block. */
  group?: boolean;
}

/**
 * Fades and lifts content once as it enters the viewport.
 * `data-reveal` lets the <noscript> rule in the root layout show the content
 * when JavaScript is unavailable.
 */
export function Reveal({ children, className, delay = 0, group = false }: RevealProps) {
  return (
    <m.div
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={revealViewport}
      variants={group ? stagger : fadeRise}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </m.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  /** Render as a list item when used directly inside <ul>/<ol>. */
  as?: "div" | "li";
}

export function RevealItem({ children, className, as = "div" }: RevealItemProps) {
  const Component = as === "li" ? m.li : m.div;
  return (
    <Component data-reveal="" className={className} variants={fadeRise} transition={revealTransition}>
      {children}
    </Component>
  );
}
