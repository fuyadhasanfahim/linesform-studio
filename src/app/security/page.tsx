import type { Metadata } from "next";
import { LegalDocument, legal, type LegalSection } from "@/components/legal/legal-document";
import { pageUrls, site } from "@/content/site";

const urls = pageUrls("/security");

export const metadata: Metadata = {
  title: "Security",
  description:
    "The security measures the Linesform Studio website actually has, what it does not have yet, and how to report a problem.",
  alternates: urls.alternates,
  openGraph: { ...urls.openGraphUrl, title: `Security — ${site.name}` },
};

const sections: LegalSection[] = [
  {
    id: "scope",
    heading: "What there is to protect",
    content: (
      <p>
        The website is a set of public pages and one server function that handles the enquiry form. It has no user
        accounts, no passwords, no payments and no database, and it keeps no copy of enquiries.
      </p>
    ),
  },
  {
    id: "in-place",
    heading: "Measures in place",
    content: (
      <ul className={legal.list}>
        <li>
          <span className="font-medium">Enquiry form.</span> Every submission is validated on the server, whatever
          the browser sent, with length limits on each field. A hidden field filters out simple automated spam.
          Message contents are never written to logs.
        </li>
        <li>
          <span className="font-medium">Delivery.</span> Enquiries are forwarded only to an address configured by
          the site operator, and only over HTTPS. Requests time out after ten seconds and do not follow redirects;
          an optional access token for the receiving service stays on the server.
        </li>
        <li>
          <span className="font-medium">Secrets.</span> Configuration secrets live in server-side environment
          variables and are never sent to the browser. Environment files are excluded from the code repository.
        </li>
        <li>
          <span className="font-medium">Browser protections.</span> Every response tells browsers not to guess file
          types, limits the referrer information sent to other sites, refuses to be embedded in other websites&rsquo;
          frames, and switches off camera, microphone and location access.
        </li>
        <li>
          <span className="font-medium">Third-party code.</span> No third-party script is loaded unless you allow
          optional cookies. Fonts and images are served from the website itself.
        </li>
        <li>
          <span className="font-medium">No image or AI endpoints.</span> Images were prepared in advance; the website
          has no function that calls an image-generation or other paid service.
        </li>
      </ul>
    ),
  },
  {
    id: "not-yet",
    heading: "Not yet in place",
    content: (
      <>
        <p>To be clear about the limits of the measures above, the website does not currently have:</p>
        <ul className={legal.list}>
          <li>a Content Security Policy restricting which scripts may run;</li>
          <li>rate limiting on the enquiry form beyond the spam filter;</li>
          <li>automated dependency vulnerability scanning in its code repository;</li>
          <li>a published security.txt file or a vulnerability disclosure programme.</li>
        </ul>
        <p>
          Encrypted connections (HTTPS) and transport security headers depend on the hosting provider&rsquo;s
          configuration.
        </p>
      </>
    ),
  },
  {
    id: "report",
    heading: "Reporting a problem",
    content: site.contactEmail ? (
      <p>
        If you believe you have found a security problem, please write to{" "}
        <a href={`mailto:${site.contactEmail}`} className={legal.link}>
          {site.contactEmail}
        </a>{" "}
        with enough detail to reproduce it. Please do not include personal data belonging to others.
      </p>
    ) : (
      <p>
        This concept does not publish a security contact. A real practice must add one here before launch, ideally
        alongside a security.txt file.
      </p>
    ),
  },
];

export default function SecurityPage() {
  return (
    <LegalDocument
      path="/security"
      title="Security"
      updated="16 October 2026"
      summary={<p>A plain account of how this website is protected — and of what is not in place yet.</p>}
      sections={sections}
    />
  );
}
