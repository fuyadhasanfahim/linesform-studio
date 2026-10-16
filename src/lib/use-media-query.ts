"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without re-rendering on scroll or resize.
 * Returns `false` during server rendering, so effects gated on it start
 * disabled and only switch on in capable browsers.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
