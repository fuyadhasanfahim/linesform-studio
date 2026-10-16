"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/content/site";
import { cn } from "@/lib/cn";
import { HomeLink } from "./home-link";
import { MobileNav } from "./mobile-nav";
import { Wordmark } from "./wordmark";

const HIDE_AFTER = 160;

export function isCurrent(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky header that steps out of the way while reading (scrolling down)
 * and returns as soon as the reader scrolls up. State only changes when the
 * direction changes, so scrolling does not cause continuous re-renders.
 * It is always visible while it contains keyboard focus.
 */
export function SiteHeader({
  items,
  disclosure,
}: {
  items: readonly NavItem[];
  disclosure: string;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 8);
    if (current < HIDE_AFTER) setHidden(false);
    else if (current > previous + 4) setHidden(true);
    else if (current < previous - 4) setHidden(false);
  });

  return (
    <header
      data-hidden={hidden}
      className={cn(
        "sticky top-0 z-40 border-b bg-limestone transition-[transform,border-color] duration-500 ease-architectural",
        "[&[data-hidden=true]:not(:focus-within)]:-translate-y-full",
        scrolled ? "border-[var(--line)]" : "border-transparent",
      )}
    >
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-6">
        <HomeLink className="-my-2 py-2">
          <Wordmark />
        </HomeLink>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="link-draw text-[0.9375rem] font-medium tracking-[0.01em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav items={items} disclosure={disclosure} />
      </div>
    </header>
  );
}
