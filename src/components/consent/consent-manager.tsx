"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";
import {
  getConsent,
  getServerConsent,
  onOpenCookieSettings,
  saveConsent,
  subscribeConsent,
  type ConsentChoice,
} from "@/lib/consent/store";
import { clearTrackingCookies, isContainerRequested, updateConsentSignals } from "@/lib/tracking/data-layer";

type Flags = Pick<ConsentChoice, "analytics" | "marketing">;

const CATEGORIES = [
  {
    key: "analytics",
    title: "Analytics",
    body: "Measurement tags loaded through Google Tag Manager, such as Google Analytics, to understand which pages are visited.",
  },
  {
    key: "marketing",
    title: "Marketing",
    body: "Advertising and conversion tags loaded through Google Tag Manager, such as Google Ads or Meta Pixel.",
  },
] as const satisfies readonly { key: keyof Flags; title: string; body: string }[];

const buttonClass =
  "inline-flex min-h-11 items-center justify-center bg-charcoal px-5 text-[0.875rem] font-medium text-limestone transition-colors duration-300 hover:bg-olive-ink focus-visible:outline-charcoal";
const textButtonClass =
  "min-h-11 text-[0.875rem] font-medium underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-current";

/**
 * First-visit cookie choice and the preferences panel. Rendered only when a
 * GTM container is configured — otherwise the site has no optional cookies.
 * It is a non-modal region placed early in the document so keyboard and
 * screen-reader users meet it first; it never blocks the page.
 */
export function ConsentManager() {
  const choice = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  const [view, setView] = useState<"banner" | "preferences">("banner");
  // Opened from the footer control; independent of whether a choice exists.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<Flags>({ analytics: false, marketing: false });
  const [announcement, setAnnouncement] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const headingId = useId();

  const needsChoice = choice === null;
  const visible = needsChoice || settingsOpen;
  const showPreferences = settingsOpen || view === "preferences";

  // Lets other fixed elements (the contact assistant) step aside.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-consent-open", visible);
    return () => document.documentElement.removeAttribute("data-consent-open");
  }, [visible]);

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const current = getConsent();
        setDraft({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });
        setSettingsOpen(true);
        setFocusRequest((n) => n + 1);
      }),
    [],
  );

  // Move focus to the panel title when the panel is opened on request.
  useEffect(() => {
    if (focusRequest > 0) headingRef.current?.focus();
  }, [focusRequest]);

  function openPreferences() {
    setDraft({ analytics: choice?.analytics ?? false, marketing: choice?.marketing ?? false });
    setView("preferences");
    setFocusRequest((n) => n + 1);
  }

  function close() {
    const target = returnFocus.current;
    returnFocus.current = null;
    if (target?.isConnected) target.focus();
    else if (panelRef.current?.contains(document.activeElement)) {
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    setSettingsOpen(false);
    setView("banner");
  }

  function commit(next: Flags) {
    const previous = getConsent();
    const revoked =
      isContainerRequested() &&
      previous !== null &&
      ((previous.analytics && !next.analytics) || (previous.marketing && !next.marketing));
    saveConsent(next);
    setAnnouncement("Cookie preferences saved.");
    if (revoked) {
      // Tags already running in this page cannot be unloaded: deny consent,
      // remove their cookies and reload so they are gone entirely.
      updateConsentSignals(next);
      clearTrackingCookies();
      window.location.reload();
      return;
    }
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") return;
    if (settingsOpen) {
      event.stopPropagation();
      close();
    } else if (view === "preferences") {
      event.stopPropagation();
      setView("banner");
      setFocusRequest((n) => n + 1);
    }
  }

  return (
    <>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {visible ? (
        <section
          ref={panelRef}
          aria-labelledby={headingId}
          onKeyDown={onKeyDown}
          className={cn(
            "fixed inset-x-3 bottom-3 z-50 max-h-[calc(100dvh-1.5rem)] overflow-y-auto border border-[var(--line-strong)] bg-limestone p-5 text-charcoal shadow-[0_24px_60px_-30px_rgb(37_39_34/0.5)]",
            "sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[min(29rem,calc(100vw-2.5rem))] sm:p-6",
          )}
        >
          <h2 id={headingId} ref={headingRef} tabIndex={-1} className="t-label text-olive-ink focus:outline-none">
            {showPreferences ? "Cookie preferences" : "Cookies"}
          </h2>

          {showPreferences ? (
            <>
              <p className="t-small mt-3">
                Choose which optional tags may run. Essential storage only remembers this choice.
                Details are in the{" "}
                <Link href="/cookies" className="underline underline-offset-4 hover:no-underline">
                  cookie policy
                </Link>
                .
              </p>
              <ul className="mt-4 border-b border-[var(--line)]">
                <li className="rule flex items-start justify-between gap-6 py-3.5">
                  <span>
                    <span className="block text-[0.9375rem] font-medium">Essential</span>
                    <span className="t-small block text-olive-ink">
                      Remembers your choice in this browser. The site sets no cookies of its own.
                    </span>
                  </span>
                  <span className="t-small shrink-0 pt-0.5 text-olive-ink">Always on</span>
                </li>
                {CATEGORIES.map((category) => (
                  <li key={category.key} className="rule">
                    <label className="flex cursor-pointer items-start justify-between gap-6 py-3.5">
                      <span>
                        <span className="block text-[0.9375rem] font-medium">{category.title}</span>
                        <span className="t-small block text-olive-ink">{category.body}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2.5 pt-0.5">
                        <span aria-hidden="true" className="t-small w-6 text-right text-olive-ink">
                          {draft[category.key] ? "On" : "Off"}
                        </span>
                        <input
                          type="checkbox"
                          role="switch"
                          className="switch"
                          checked={draft[category.key]}
                          onChange={(event) =>
                            setDraft((previous) => ({ ...previous, [category.key]: event.target.checked }))
                          }
                        />
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" className={buttonClass} onClick={() => commit(draft)}>
                  Save preferences
                </button>
                <button
                  type="button"
                  className={textButtonClass}
                  onClick={() => commit({ analytics: false, marketing: false })}
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  className={textButtonClass}
                  onClick={() => commit({ analytics: true, marketing: true })}
                >
                  Accept all
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="t-small mt-3">
                This site sets no cookies of its own. With your permission it loads optional analytics
                and marketing tags through Google Tag Manager. You can change your choice at any time
                from the footer. Read the{" "}
                <Link href="/cookies" className="underline underline-offset-4 hover:no-underline">
                  cookie policy
                </Link>
                .
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => commit({ analytics: false, marketing: false })}
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => commit({ analytics: true, marketing: true })}
                >
                  Accept all
                </button>
                <button type="button" className={cn(textButtonClass, "col-span-2 justify-self-start")} onClick={openPreferences}>
                  Manage preferences
                </button>
              </div>
            </>
          )}
        </section>
      ) : null}
    </>
  );
}
