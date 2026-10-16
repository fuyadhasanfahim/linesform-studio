import type { Metadata } from "next";
import { LegalDocument, legal, type LegalSection } from "@/components/legal/legal-document";
import { pageUrls, site } from "@/content/site";

const urls = pageUrls("/accessibility");

export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "How the Linesform Studio website approaches accessibility, how it has been tested, its known limitations and how to give feedback.",
  alternates: urls.alternates,
  openGraph: { ...urls.openGraphUrl, title: `Accessibility statement — ${site.name}` },
};

const sections: LegalSection[] = [
  {
    id: "status",
    heading: "Conformance status",
    content: (
      <p>
        The website is designed to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. It has
        not been formally audited, so it does not claim full conformance. The checks below found no outstanding
        issues when this statement was written, but automated and in-house testing cannot cover every criterion
        or every way people use the web.
      </p>
    ),
  },
  {
    id: "design",
    heading: "How the site is built",
    content: (
      <ul className={legal.list}>
        <li>Semantic headings, landmarks and lists, and a &ldquo;Skip to content&rdquo; link.</li>
        <li>
          Text and interface colours chosen for contrast: body text on limestone exceeds 12:1, and the secondary
          olive and stone tones exceed 4.5:1 on their backgrounds.
        </li>
        <li>
          Everything works with a keyboard, with visible focus: navigation, the mobile menu, the enquiry form and
          its option lists, the questions on the homepage, the contact assistant and cookie settings.
        </li>
        <li>
          Motion is short and decorative. With &ldquo;reduce motion&rdquo; turned on in your system settings,
          animations are switched off, and no content is hidden while it waits to animate.
        </li>
        <li>Content remains readable without JavaScript, and layouts reflow down to a 320-pixel-wide screen.</li>
        <li>
          Form errors are described in text, linked to their fields and announced, and nothing you type is lost if
          an enquiry cannot be sent.
        </li>
      </ul>
    ),
  },
  {
    id: "testing",
    heading: "How it has been tested",
    content: (
      <ul className={legal.list}>
        <li>Automated checks with axe-core on every page at mobile and desktop widths.</li>
        <li>Lighthouse accessibility audits.</li>
        <li>Keyboard-only testing of every interactive component listed above.</li>
        <li>Checks with reduced motion enabled and with JavaScript disabled.</li>
      </ul>
    ),
  },
  {
    id: "limitations",
    heading: "Known limitations",
    content: (
      <ul className={legal.list}>
        <li>The website has not yet been tested by people who use screen readers or other assistive technology.</li>
        <li>
          The images are generated illustrations. Their descriptions say what each image shows, but they are not
          photographs of real buildings.
        </li>
        <li>No independent accessibility audit has been carried out.</li>
      </ul>
    ),
  },
  {
    id: "feedback",
    heading: "Feedback",
    content: site.contactEmail ? (
      <p>
        If something on the website is hard to use, please write to{" "}
        <a href={`mailto:${site.contactEmail}`} className={legal.link}>
          {site.contactEmail}
        </a>{" "}
        and describe the page and what happened.
      </p>
    ) : (
      <p>
        This concept does not publish a contact address. A real practice must give a way to report accessibility
        problems here, and say how quickly it will respond.
      </p>
    ),
  },
];

export default function AccessibilityPage() {
  return (
    <LegalDocument
      path="/accessibility"
      title="Accessibility statement"
      updated="16 October 2026"
      summary={<p>The website should be usable by as many people as possible, however they browse.</p>}
      sections={sections}
    />
  );
}
