import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { LegalDocument, legal, type LegalSection } from "@/components/legal/legal-document";
import { pageUrls, site } from "@/content/site";
import { hasOptionalTracking } from "@/lib/tracking/config";

const urls = pageUrls("/cookies");

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "The cookies and browser storage the Linesform Studio website uses, which are optional, and how to change your choice.",
  alternates: urls.alternates,
  openGraph: { ...urls.openGraphUrl, title: `Cookie policy — ${site.name}` },
};

/** Cookies the supported tags can set — only after consent, and only if configured in GTM. */
const OPTIONAL_COOKIES = [
  { category: "Analytics", tag: "Google Analytics 4", cookies: ["_ga", "_ga_<ID>"], lifetime: "Up to 2 years" },
  { category: "Marketing", tag: "Google Ads", cookies: ["_gcl_au"], lifetime: "90 days" },
  { category: "Marketing", tag: "Meta Pixel", cookies: ["_fbp", "_fbc"], lifetime: "90 days" },
];

/**
 * Generated from the same build-time configuration that decides whether the
 * consent panel and Google Tag Manager exist, so the policy always matches
 * what the site actually does.
 */
const sections: LegalSection[] = hasOptionalTracking
  ? [
      {
        id: "own",
        heading: "Cookies set by this website",
        content: (
          <p>
            None. The website itself does not set cookies — not for sessions, preferences or measurement.
          </p>
        ),
      },
      {
        id: "storage",
        heading: "Essential browser storage",
        content: (
          <>
            <p>
              Your cookie choice is remembered in your browser&rsquo;s local storage under the key{" "}
              <code className={legal.code}>linesform-consent</code>. It records whether you allowed analytics and
              marketing, and when. It is never sent to a server, and after twelve months you are asked again.
            </p>
            <p>This storage is essential: without it the question would be asked on every page.</p>
          </>
        ),
      },
      {
        id: "optional",
        heading: "Optional cookies — only with your permission",
        content: (
          <>
            <p>
              If you allow optional cookies, the website loads Google Tag Manager, which can run tags that set
              their own cookies. Before you choose, Tag Manager is not loaded at all. Which tags run depends on how
              the site&rsquo;s Tag Manager container is configured; these are the cookies the supported tags can
              set:
            </p>
            {/* A stacked list rather than a table, so it reflows on narrow screens without sideways scrolling. */}
            <ul className="border-b border-[var(--line)]">
              {OPTIONAL_COOKIES.map((row) => (
                <li key={row.tag} className="rule py-3.5">
                  <p className="font-medium">
                    {row.tag} <span className="t-small font-normal text-olive-ink">· {row.category}</span>
                  </p>
                  <dl className="t-small mt-1.5 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-1">
                    <dt className="text-olive-ink">Cookies</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {row.cookies.map((name) => (
                        <code key={name} className={legal.code}>
                          {name}
                        </code>
                      ))}
                    </dd>
                    <dt className="text-olive-ink">Typical lifetime</dt>
                    <dd>{row.lifetime}</dd>
                  </dl>
                </li>
              ))}
            </ul>
            <p>
              Google&rsquo;s Consent Mode is set to &ldquo;denied&rdquo; for every optional purpose before Tag
              Manager starts, and only the categories you allow are switched on.
            </p>
          </>
        ),
      },
      {
        id: "change",
        heading: "Changing your choice",
        content: (
          <>
            <p>
              You can change your choice at any time. If you withdraw permission, the optional cookies listed above
              are deleted and the page reloads so that no optional tag keeps running.
            </p>
            <p>
              <CookieSettingsButton className="inline-flex min-h-11 items-center bg-charcoal px-5 text-[0.875rem] font-medium text-limestone transition-colors duration-300 hover:bg-olive-ink focus-visible:outline-charcoal" />
            </p>
            <p>You can also clear cookies and site data at any time in your browser&rsquo;s settings.</p>
          </>
        ),
      },
    ]
  : [
      {
        id: "own",
        heading: "Cookies",
        content: (
          <p>
            This website sets no cookies. It loads no analytics, advertising or other third-party tracking, so
            there is nothing optional to accept and no cookie banner is shown.
          </p>
        ),
      },
      {
        id: "storage",
        heading: "Browser storage",
        content: <p>The website does not use local storage, session storage or similar technologies.</p>,
      },
      {
        id: "future",
        heading: "If this changes",
        content: (
          <p>
            If optional analytics or marketing tags are added, they will load only after you agree, you will be
            able to change your choice at any time, and this policy will list what they set.
          </p>
        ),
      },
    ];

export default function CookiesPage() {
  return (
    <LegalDocument
      path="/cookies"
      title="Cookie policy"
      updated="16 October 2026"
      summary={
        hasOptionalTracking ? (
          <p>
            The website sets no cookies of its own. Optional analytics and marketing tags run only if you allow
            them, and you can change your mind at any time.
          </p>
        ) : (
          <p>The website sets no cookies and uses no tracking.</p>
        )
      }
      sections={sections}
    />
  );
}
