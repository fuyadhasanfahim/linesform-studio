import { EnquiryForm } from "@/components/contact/enquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { site } from "@/content/site";
import { contact } from "@/content/studio";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="shell section-space">
      <div className="grid-page gap-y-14">
        <Reveal className="col-span-12 lg:col-span-5">
          <SectionLabel index="05">{contact.label}</SectionLabel>
          <h2 id="contact-heading" className="t-h2 mt-6 max-w-[13ch]">
            {contact.heading}
          </h2>
          <p className="t-lead mt-7 measure">{contact.body}</p>
          {site.contactEmail ? (
            <p className="mt-6">
              Or write to{" "}
              <a href={`mailto:${site.contactEmail}`} className="link-draw font-medium">
                {site.contactEmail}
              </a>
            </p>
          ) : null}
          <p className="t-small mt-10 max-w-sm border-l border-[var(--line-strong)] pl-4 text-olive-ink">
            {contact.conceptNote}
          </p>
        </Reveal>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-3">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
