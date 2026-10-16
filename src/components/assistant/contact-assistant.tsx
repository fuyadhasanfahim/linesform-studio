"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

const loadPanel = () => import("./assistant-panel").then((module) => module.AssistantPanel);
const AssistantPanel = dynamic(loadPanel, { ssr: false });

/**
 * A small contact assistant. It is not live chat and says so: answers are
 * written in advance (from the FAQ), and every route leads to the enquiry
 * form, the FAQ or the work. Nothing chosen in it is sent anywhere.
 *
 * Only the launcher is part of the initial page; the panel's code loads on
 * first use (fetched early when the pointer or keyboard focus reaches the
 * launcher). The launcher steps aside while the cookie panel or mobile menu
 * is open and while the questions, the enquiry form or the footer are on
 * screen, so it never covers their controls.
 */
export function ContactAssistant({ contactEmail }: { contactEmail?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stepAside, setStepAside] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Watch the sections the launcher should not cover. Re-queried on every
  // route, because the layout (and this component) persists across routes.
  useEffect(() => {
    const targets = [document.getElementById("faq"), document.getElementById("contact"), document.querySelector("footer")].filter(
      (element): element is HTMLElement => element !== null,
    );
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setStepAside(visible.size > 0);
    });
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  function close({ restoreFocus = true } = {}) {
    setOpen(false);
    if (restoreFocus) launcherRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      close();
    }
  }

  return (
    <div className="assistant" data-hidden={(stepAside && !open) || undefined} onKeyDown={onKeyDown}>
      {open ? <AssistantPanel id={panelId} contactEmail={contactEmail} onClose={close} /> : null}

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close contact assistant" : "Open contact assistant"}
        onClick={() => (open ? close() : setOpen(true))}
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        className="assistant-launcher fixed right-3 bottom-3 z-40 flex h-12 w-12 items-center justify-center bg-charcoal text-limestone shadow-[0_16px_36px_-18px_rgb(37_39_34/0.7)] transition-colors duration-300 hover:bg-olive-ink focus-visible:outline-charcoal sm:right-5 sm:bottom-5 sm:h-14 sm:w-14"
      >
        {open ? (
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
          </span>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.1">
            {/* A speech mark drawn in the site's thin-line idiom. */}
            <path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z" strokeLinejoin="round" />
            <path d="M8 9.25h8M8 12h5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
