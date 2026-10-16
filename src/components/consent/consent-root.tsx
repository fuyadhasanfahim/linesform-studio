"use client";

import dynamic from "next/dynamic";

/*
 * The consent panel and the GTM loader render nothing on the server (the
 * visitor's choice lives in the browser), so they are loaded as separate
 * chunks after hydration and only on builds with a GTM container — sites
 * without one never download this code.
 */
const ConsentManager = dynamic(() => import("./consent-manager").then((m) => m.ConsentManager), { ssr: false });
const TagManager = dynamic(() => import("./tag-manager").then((m) => m.TagManager), { ssr: false });

export function ConsentRoot({ gtmId }: { gtmId: string }) {
  return (
    <>
      <ConsentManager />
      <TagManager gtmId={gtmId} />
    </>
  );
}
