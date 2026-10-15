import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  direction?: "forward" | "back";
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

/** Text link with a drawn arrow — the site's primary call to action. */
export function ArrowLink({ href, children, className, direction = "forward" }: ArrowLinkProps) {
  return (
    <Link
      href={href}
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
