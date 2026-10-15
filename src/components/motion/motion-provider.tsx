"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * `domAnimation` covers animations, variants, in-view and hover gestures —
 * everything the site uses — without the layout/drag bundle.
 * `reducedMotion="user"` drops transform animation for users who ask for it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
