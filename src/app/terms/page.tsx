import type { Metadata } from "next";
import { LegalDocument, legal, type LegalSection } from "@/components/legal/legal-document";
import { pageUrls, site } from "@/content/site";

const urls = pageUrls("/terms");

export const metadata: Metadata = {
  title: "Terms & conditions",
  description:
    "The terms for using the Linesform Studio website: a portfolio concept by Midline Seven that offers no services and whose projects are fictional.",
  alternates: urls.alternates,
  openGraph: { ...urls.openGraphUrl, title: `Terms & conditions — ${site.name}` },
};

const sections: LegalSection[] = [
  {
    id: "about",
    heading: "What this website is",
    content: (
      <>
        <p>
          Linesform Studio is a fictional architecture and interior design practice. This website was designed and
          built by{" "}
          <a href={site.creatorUrl} className={legal.link}>
            Midline Seven
          </a>{" "}
          as a portfolio concept.
        </p>
        <p>
          Nothing on the website is an offer of services, a quotation or a promise of availability, and no
          services can be bought through it.
        </p>
      </>
    ),
  },
  {
    id: "content",
    heading: "Projects, images and statements",
    content: (
      <ul className={legal.list}>
        <li>
          The projects, sites, clients and dates are conceptual. No building shown here has been built by Linesform
          Studio.
        </li>
        <li>The images are generated illustrations, not photographs of real places or completed work.</li>
        <li>
          The client statements on the homepage are illustrative copy, labelled as such, and are not quotes from
          real people.
        </li>
      </ul>
    ),
  },
  {
    id: "enquiries",
    heading: "Enquiries",
    content: (
      <p>
        Sending an enquiry does not create an agreement of any kind. An enquiry is delivered only when an enquiry
        service has been connected, and the form says plainly whether yours was sent. See the privacy policy for how
        enquiries are handled.
      </p>
    ),
  },
  {
    id: "ownership",
    heading: "Ownership and reuse",
    content: (
      <p>
        The design, text and images of this website belong to Midline Seven unless stated otherwise. You may link to
        the website and share pages for personal, non-commercial purposes, but please do not republish its content
        or images without permission.
      </p>
    ),
  },
  {
    id: "warranty",
    heading: "No warranty",
    content: (
      <p>
        The website is provided as it is, for illustration. Its content is not professional, architectural or
        construction advice and should not be relied on for any real project.
      </p>
    ),
  },
  {
    id: "links",
    heading: "Links to other websites",
    content: (
      <p>The website links to midlineseven.com. Other websites are responsible for their own content and policies.</p>
    ),
  },
  {
    id: "changes",
    heading: "Changes and governing law",
    content: (
      <p>
        These terms may be updated as the website changes; the date at the top shows the latest version. No
        governing law or legal entity has been set for this concept — a real practice would state both here.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      path="/terms"
      title="Terms & conditions"
      updated="16 October 2026"
      summary={
        <p>
          Linesform Studio is a portfolio concept. The website presents fictional work, offers no services and makes
          no guarantees.
        </p>
      }
      sections={sections}
    />
  );
}
