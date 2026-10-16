import { cacheLife } from "next/cache";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { site } from "@/content/site";
import { hasOptionalTracking } from "@/lib/tracking/config";
import { ctaAttributes } from "@/lib/tracking/cta";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-limestone">
      <div className="shell pt-[var(--space-block)] pb-8">
        <div className="grid-page gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="t-label text-stone">Linesform Studio</p>
            <p className="t-h3 mt-5 max-w-md font-normal">
              Architecture and interiors shaped by light, material and purpose.
            </p>
            <p className="t-small mt-6 max-w-md text-stone">{site.disclosure}</p>
          </div>

          <nav aria-label="Footer" className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 sm:grid-cols-3">
              {site.footer.map((group) => (
                <div key={group.heading}>
                  <h2 className="t-label text-stone">{group.heading}</h2>
                  <ul className="mt-5 space-y-2.5">
                    {group.heading === "Enquiries" && site.contactEmail ? (
                      <li>
                        <a href={`mailto:${site.contactEmail}`} className="link-draw break-all">
                          {site.contactEmail}
                        </a>
                      </li>
                    ) : null}
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          {...(link.href === site.primaryCta.href
                            ? ctaAttributes({ id: "start_project", location: "footer" })
                            : {})}
                          className="link-draw"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {group.heading === "Information" && hasOptionalTracking ? (
                      <li>
                        <CookieSettingsButton className="link-draw cursor-pointer text-left" />
                      </li>
                    ) : null}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* The full lockup, sized to the container so the word is never cropped. */}
        <div aria-hidden="true" className="@container mt-[var(--space-block)] select-none">
          <p className="footer-wordmark text-limestone/90">Linesform</p>
          <p className="t-label mt-[0.6em] text-right text-[clamp(0.6875rem,0.55rem+0.5vw,1rem)] tracking-[0.34em] text-stone">
            Studio
          </p>
        </div>

        <div className="rule-inverse mt-8 flex flex-col gap-2 pt-6 text-[0.8125rem] text-stone sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> {site.creator}. A portfolio concept.
          </p>
          <p>
            Designed and built by{" "}
            <a
              href={site.creatorUrl}
              className="text-limestone underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] decoration-1 underline-offset-[0.3em] transition-[text-decoration-color] duration-300 hover:decoration-current focus-visible:decoration-current"
            >
              {site.creator}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
