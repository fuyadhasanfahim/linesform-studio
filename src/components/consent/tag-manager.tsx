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
      <ContactClicks />
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

function ContactClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) track("contact_click", { link_type: "email" });
      else if (/#(contact|enquiry)$/.test(href)) track("contact_click", { link_type: "enquiry_form" });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
