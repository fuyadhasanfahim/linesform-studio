import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, legal, type LegalSection } from "@/components/legal/legal-document";
import { pageUrls, site } from "@/content/site";
import { hasOptionalTracking } from "@/lib/tracking/config";

const urls = pageUrls("/privacy");

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What the Linesform Studio website collects through its enquiry form, why, how it is handled and how optional analytics are controlled.",
  alternates: urls.alternates,
  openGraph: { ...urls.openGraphUrl, title: `Privacy policy — ${site.name}` },
};

const contactLine = site.contactEmail ? (
  <p>
    Questions about this policy, or requests to see or delete an enquiry you sent, can go to{" "}
    <a href={`mailto:${site.contactEmail}`} className={legal.link}>
      {site.contactEmail}
    </a>
    .
  </p>
) : (
  <p>
    This concept does not publish a contact address. A real practice must name who is responsible for
    personal data and how to reach them here.
  </p>
);

const sections: LegalSection[] = [
  {
    id: "collected",
    heading: "What the enquiry form collects",
    content: (
      <>
        <p>The only personal information this website asks for is what you enter in the project enquiry form:</p>
        <ul className={legal.list}>
          <li>your name and email address;</li>
          <li>the type of project and, if you choose to give one, an indicative budget range;</li>
          <li>your message about the project.</li>
        </ul>
        <p>
          The form also contains a hidden field that people never see. Automated spam tools tend to fill it in,
          and submissions where it is filled are rejected. It does not collect anything about you.
        </p>
      </>
    ),
  },
  {
    id: "purpose",
    heading: "Why it is collected",
    content: (
      <p>
        Your details are used only to read and answer your enquiry. They are not used for marketing, not added
        to a mailing list and not sold. A real practice would also state its lawful basis for this processing
        here.
      </p>
    ),
  },
  {
    id: "handling",
    heading: "How enquiries are handled",
    content: (
      <>
        <p>
          The form is checked in your browser and again on the server. What happens next depends on whether
          an enquiry service has been connected to the website:
        </p>
        <ul className={legal.list}>
          <li>
            <span className="font-medium">When a service is connected</span>, your enquiry is sent to it over
            an encrypted (HTTPS) connection so that it can be answered. The form confirms that it was sent only
            after the service accepts it.
          </li>
          <li>
            <span className="font-medium">When no service is connected</span>, your enquiry is checked and then
            discarded. Nothing is stored or forwarded, and the form tells you that it was not sent.
          </li>
        </ul>
        <p>
          The website itself has no database and keeps no copy of enquiries. Message contents are never written
          to the website&rsquo;s logs. How long a connected service keeps enquiries is set by whoever operates
          it; no retention period has been defined for this concept.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    heading: "Analytics and cookies",
    content: hasOptionalTracking ? (
      <>
        <p>
          With your permission, this website loads Google Tag Manager, which can run optional analytics and
          marketing tags such as Google Analytics, Google Ads or Meta Pixel. Nothing is loaded until you allow
          it, and you can change your choice at any time with &ldquo;Cookie settings&rdquo; in the footer.
        </p>
        <p>
          These tags receive page addresses and a small set of events (for example, that the enquiry form was
          submitted or that it was delivered). They never receive your name, email address or anything you
          write in the form. See the{" "}
          <Link href="/cookies" className={legal.link}>
            cookie policy
          </Link>{" "}
          for details.
        </p>
      </>
    ) : (
      <p>
        This website uses no analytics or advertising tags and sets no cookies. See the{" "}
        <Link href="/cookies" className={legal.link}>
          cookie policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: "third-parties",
    heading: "Other services involved",
    content: (
      <ul className={legal.list}>
        <li>
          <span className="font-medium">Hosting.</span> The hosting provider may keep short-lived technical
          logs, such as IP addresses and request times, to keep the service secure and reliable.
        </li>
        <li>
          <span className="font-medium">Fonts and images</span> are served from this website, not from an
          external font or image service.
        </li>
        <li>
          <span className="font-medium">Enquiry service</span> — only if one is connected, as described above.
        </li>
        {hasOptionalTracking ? (
          <li>
            <span className="font-medium">Google Tag Manager</span> and the tags it loads — only after you allow
            optional cookies.
          </li>
        ) : null}
      </ul>
    ),
  },
  {
    id: "choices",
    heading: "Your choices and questions",
    content: (
      <>
        <p>
          You can choose not to use the enquiry form. Where data protection law gives you rights — for example
          to see, correct or delete information about you — a real practice would explain how to exercise them
          here.
        </p>
        {contactLine}
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      path="/privacy"
      title="Privacy policy"
      updated="16 October 2026"
      summary={
        <p>
          This website collects personal information in one place only — the project enquiry form — and uses it
          only to answer your enquiry.
        </p>
      }
      sections={sections}
    />
  );
}
