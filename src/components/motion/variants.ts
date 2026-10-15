import type { Transition, Variants } from "motion/react";

export const EASE_ARCHITECTURAL = [0.22, 1, 0.36, 1] as const;

export const revealTransition: Transition = {
  duration: 0.9,
  ease: EASE_ARCHITECTURAL,
};

/** Shared viewport settings: animate once, slightly before fully in view. */
export const revealViewport = { once: true, margin: "0px 0px -12% 0px" } as const;

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0 },
};

export const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09 } },
};
