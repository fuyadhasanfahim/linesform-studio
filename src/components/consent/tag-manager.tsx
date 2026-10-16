"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { getConsent, getServerConsent, subscribeConsent, type ConsentChoice } from "@/lib/consent/store";
import {
  initialiseConsentSignals,
  isContainerRequested,
  track,
  updateConsentSignals,
} from "@/lib/tracking/data-layer";

/**
 * Loads the GTM container only after the visitor has allowed at least one
 * optional category. Nothing is requested from Google before that.
 */
export function TagManager({ gtmId }: { gtmId: string }) {
  const choice = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  if (!choice || !(choice.analytics || choice.marketing)) return null;

  return (
    <>
      {/* Order matters: consent signals (a layout effect) are queued before the
          container script, which next/script inserts in a passive effect. */}
      <ConsentSignals choice={choice} />
      <GoogleTagManager gtmId={gtmId} />
      <PageViews />
      <LinkClicks />
    </>
  );
}

function ConsentSignals({ choice }: { choice: ConsentChoice }) {
  useLayoutEffect(() => {
    if (isContainerRequested()) updateConsentSignals(choice);
    else initialiseConsentSignals(choice);
  }, [choice]);
  return null;
}

/** One virtual page view per route, the first included. Hash changes are not page views. */
function PageViews() {
  const pathname = usePathname();
  useEffect(() => {
    track("virtual_page_view", { page_path: pathname, page_location: window.location.origin + pathname });
  }, [pathname]);
  return null;
}

/**
 * One delegated listener for every tracked link. Calls to action carry
 * data-cta-id / data-cta-location (see tracking/cta.ts); a link is counted
 * once, under the first rule it matches.
 */
function LinkClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLElement)) return;
      const { ctaId, ctaLocation } = link.dataset;
      if (ctaId) track("cta_click", { cta_id: ctaId, cta_location: ctaLocation ?? "unknown" });
      else if (link.getAttribute("href")?.startsWith("mailto:")) track("contact_click", { link_type: "email" });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
