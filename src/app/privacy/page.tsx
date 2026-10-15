import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/section-label";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How the Linesform Studio website handles the information you share through its enquiry form.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

const sections = [
  {
    heading: "About this website",
    body: [
      `${site.disclosure} This notice describes how the website itself handles information.`,
    ],
  },
  {
    heading: "What is collected",
    body: [
      "The only personal information this website asks for is what you choose to enter in the project enquiry form: your name, email address, project type, an optional budget range and your message.",
      "The website does not set cookies, does not use analytics or advertising trackers and does not load third-party scripts. Fonts are served from this website rather than from an external font service.",
    ],
  },
  {
    heading: "How enquiries are handled",
    body: [
      "When an enquiry service is connected, your submission is sent securely to that service so that it can be answered. It is used only to respond to your enquiry and is not sold or used for marketing.",
      "When no enquiry service is connected, your submission is checked for completeness and then discarded: nothing is stored or forwarded, and the form tells you that your enquiry has not been sent.",
    ],
  },
  {
    heading: "Server logs",
    body: [
      "Like most websites, the hosting provider may keep short-lived technical logs, such as IP addresses and request times, to keep the service secure and reliable.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask for a copy of, or the deletion of, any enquiry you have sent through the same channel you used to contact us.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="shell section-space pt-[clamp(2.5rem,1rem+6vw,7rem)]">
      <div className="grid-page gap-y-12">
        <header className="col-span-12 lg:col-span-4">
          <SectionLabel>Legal</SectionLabel>
          <h1 className="t-h1 mt-6">Privacy notice</h1>
          <p className="t-small mt-6 text-olive-ink">Last updated 15 October 2026</p>
        </header>
        <div className="col-span-12 measure-wide lg:col-span-7 lg:col-start-6">
          {sections.map((section) => (
            <section key={section.heading} className="rule pt-5 pb-10">
              <h2 className="t-h3">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
