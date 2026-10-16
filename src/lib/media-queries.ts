/**
 * Large screen, precise pointer and no reduced-motion preference. Matches the
 * `rich` CSS variant in globals.css. Kept outside client modules so server
 * components can use it in `sizes` attributes.
 */
export const RICH_MOTION_QUERY =
  "(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
