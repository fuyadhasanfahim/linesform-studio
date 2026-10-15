"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { NavItem } from "@/content/site";
import { useMediaQuery } from "@/lib/use-media-query";
import { Wordmark } from "./wordmark";

function unlockScroll() {
  delete document.documentElement.dataset.menuOpen;
}

/**
 * Mobile navigation built on the native modal <dialog>: the browser provides
 * the focus trap, Escape handling and inert background. Scroll is locked via
 * a data attribute on <html>, and always released on close or unmount.
 */
export function MobileNav({
  items,
  disclosure,
}: {
  items: readonly NavItem[];
  disclosure: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  function openMenu() {
    dialogRef.current?.showModal();
    document.documentElement.dataset.menuOpen = "";
    setOpen(true);
  }

  function closeMenu() {
    unlockScroll();
    dialogRef.current?.close();
  }

  // Fires for Escape, the close button and link navigation alike.
  function handleClose() {
    unlockScroll();
    setOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }

  // The menu has no meaning on desktop: close it if the viewport grows.
  useEffect(() => {
    if (isDesktop && dialogRef.current?.open) {
      unlockScroll();
      dialogRef.current.close();
    }
  }, [isDesktop]);

  // Never leave the page scroll-locked if this component is hidden or unmounted.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      unlockScroll();
      dialog?.close();
    };
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={openMenu}
        className="-mr-2 flex min-h-11 items-center gap-3 px-2 text-[0.9375rem] font-medium md:hidden"
      >
        Menu
        <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-2/3 self-end bg-current" />
        </span>
      </button>

      <dialog
        id="site-menu"
        ref={dialogRef}
        aria-label="Site navigation"
        onClose={handleClose}
        className="nav-dialog md:hidden"
      >
        <div className="shell flex h-full flex-col pb-8">
          <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between">
            <Link href="/" onClick={closeMenu} aria-label="Linesform Studio, home" className="-my-2 py-2">
              <Wordmark inverse />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="-mr-2 flex min-h-11 items-center gap-3 px-2 text-[0.9375rem] font-medium"
            >
              Close
              <span aria-hidden="true" className="relative block h-4 w-4">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-[12vh]">
            <ul className="flex flex-col">
              {items.map((item, index) => (
                <li
                  key={item.href}
                  className="nav-dialog-item rule-inverse"
                  style={{ "--i": index } as CSSProperties}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="t-h2">{item.label}</span>
                    <span aria-hidden="true" className="t-numeral text-lg text-stone">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p
            className="nav-dialog-item t-small mt-auto max-w-xs text-stone"
            style={{ "--i": items.length } as CSSProperties}
          >
            {disclosure}
          </p>
        </div>
      </dialog>
    </>
  );
}
