import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ctaAttributes, type CtaTag } from "@/lib/tracking/cta";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  direction?: "forward" | "back";
  cta?: CtaTag;
}

export function Arrow({ direction = "forward" }: { direction?: "forward" | "back" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 10"
      className={cn(
        "h-2.5 w-6 shrink-0 transition-transform duration-500 ease-architectural",
        direction === "back"
          ? "rotate-180 group-hover:-translate-x-1 group-focus-visible:-translate-x-1"
          : "group-hover:translate-x-1 group-focus-visible:translate-x-1",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 5h22M18 1l4 4-4 4" />
    </svg>
  );
}

/** Text link with a drawn arrow — the site's secondary call to action. */
export function ArrowLink({ href, children, className, direction = "forward", cta }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      {...ctaAttributes(cta)}
      className={cn(
        "group inline-flex min-h-11 items-center gap-4 border-b border-current pb-1 text-[0.9375rem] font-medium",
        direction === "back" && "flex-row-reverse",
        className,
      )}
    >
      <span>{children}</span>
      <Arrow direction={direction} />
    </Link>
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** "dark" is a charcoal button for light sections; "light" a limestone one for charcoal sections. */
  tone?: "dark" | "light";
  cta?: CtaTag;
}

/** Filled button-style link — reserved for the primary action, "Start a project". */
export function ButtonLink({ href, children, className, tone = "dark", cta }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      {...ctaAttributes(cta)}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-4 px-6 text-[0.9375rem] font-medium transition-colors duration-300",
        tone === "dark"
          ? "bg-charcoal text-limestone hover:bg-olive-ink focus-visible:outline-charcoal"
          : "bg-limestone text-charcoal hover:bg-stone focus-visible:outline-limestone",
        className,
      )}
    >
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
