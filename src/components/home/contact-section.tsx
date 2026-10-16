import { EnquiryForm } from "@/components/contact/enquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { site } from "@/content/site";
import { contact } from "@/content/studio";
import { cn } from "@/lib/cn";

function ConceptNote({ className }: { className: string }) {
  return (
    <p className={cn("t-small max-w-sm border-l border-[var(--line-strong)] pl-4 text-olive-ink", className)}>
      {contact.conceptNote}
    </p>
  );
}

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="shell section-space">
      <div className="grid-page gap-y-14">
        <Reveal className="col-span-12 lg:col-span-5">
          <SectionLabel>{contact.label}</SectionLabel>
          <h2 id="contact-heading" className="t-h2 mt-6 max-w-[13ch]">
            {contact.heading}
          </h2>
          <p className="t-lead mt-7 measure">{contact.body}</p>
          <div className="mt-9">
            <h3 className="t-label text-olive-ink">{contact.includeHeading}</h3>
            <ul className="mt-3 measure">
              {contact.include.map((item) => (
                <li key={item} className="rule flex gap-3 py-2.5 text-[0.9375rem]">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-olive-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {site.contactEmail ? (
            <p className="mt-6">
              Or write to{" "}
              <a href={`mailto:${site.contactEmail}`} className="link-draw font-medium">
                {site.contactEmail}
              </a>
            </p>
          ) : null}
          <ConceptNote className="mt-10 hidden lg:block" />
        </Reveal>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-3">
          <EnquiryForm />
          {/* On small screens the note follows the form, so the form is reached sooner. */}
          <ConceptNote className="mt-12 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
