import { cacheLife } from "next/cache";
import Link from "next/link";
import { site } from "@/content/site";

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
          <div className="col-span-12 lg:col-span-6">
            <p className="t-label text-stone">Linesform Studio</p>
            <p className="t-h3 mt-5 max-w-md font-normal">
              Architecture and interiors shaped by light, material and purpose.
            </p>
            <p className="t-small mt-6 max-w-md text-stone">{site.disclosure}</p>
          </div>

          <nav aria-label="Footer" className="col-span-6 sm:col-span-4 lg:col-span-3">
            <p className="t-label text-stone">Index</p>
            <ul className="mt-5 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 sm:col-span-4 lg:col-span-3">
            <p className="t-label text-stone">Enquiries</p>
            <ul className="mt-5 space-y-2.5">
              {site.contactEmail ? (
                <li>
                  <a href={`mailto:${site.contactEmail}`} className="link-draw break-all">
                    {site.contactEmail}
                  </a>
                </li>
              ) : null}
              <li>
                <Link href="/#contact" className="link-draw">
                  Project enquiry form
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="link-draw">
                  Privacy notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-[var(--space-block)] overflow-hidden font-display text-[clamp(3.75rem,25.5vw,30rem)] leading-[0.78] tracking-[-0.035em] whitespace-nowrap text-limestone/90 select-none"
        >
          Linesform
        </p>

        <div className="rule-inverse mt-8 flex flex-col gap-2 pt-6 text-[0.8125rem] text-stone sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> Midline Seven. A portfolio concept.
          </p>
          <p>Designed and built by Midline Seven.</p>
        </div>
      </div>
    </footer>
  );
}
