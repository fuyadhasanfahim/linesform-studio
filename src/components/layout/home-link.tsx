"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface HomeLinkProps {
  children: ReactNode;
  className?: string;
  /** Runs before navigating, e.g. to close the mobile menu. */
  onNavigate?: () => void;
}

/**
 * The logo link. Next.js keeps the scroll position when a link points at
 * the page already on screen, so on the homepage — including /#studio and
 * the other section anchors — a plain <Link href="/"> left the reader where
 * they were. On the homepage this removes the anchor from the URL (as a new
 * history entry, like any link) and returns to the top; on every other
 * route it is an ordinary client-side navigation, which already starts at
 * the top. Modified clicks (new tab, etc.) keep the browser's behaviour.
 */
export function HomeLink({ children, className, onNavigate }: HomeLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (pathname !== "/" || modified || event.defaultPrevented) return;
    event.preventDefault();
    if (window.location.hash || window.location.search) router.push("/", { scroll: false });
    // Follows the CSS scroll-behavior: smooth, or instant with reduced motion.
    window.scrollTo({ top: 0 });
  }

  return (
    <Link href="/" aria-label="Linesform Studio, home" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
