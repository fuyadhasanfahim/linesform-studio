"use client";

import { OPEN_SETTINGS_EVENT } from "@/lib/consent/events";

/** Footer control that reopens the cookie preferences panel. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}
