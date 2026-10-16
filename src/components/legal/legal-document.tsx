import Link from "next/link";
import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";

export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/accessibility", label: "Accessibility statement" },
  { href: "/security", label: "Security" },
] as const;

export type LegalPath = (typeof LEGAL_PAGES)[number]["href"];

export interface LegalSection {
  id: string;
  heading: string;
  content: ReactNode;
}

/** Shared classes for prose inside legal sections. */
export const legal = {
  link: "underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-current",
  list: "list-disc space-y-2 pl-5 marker:text-olive",
  code: "bg-limestone-deep px-1.5 py-0.5 font-mono text-[0.875em]",
};

interface LegalDocumentProps {
  path: LegalPath;
  title: string;
  /** Human-readable date, e.g. "16 October 2026". */
  updated: string;
  summary: ReactNode;
  sections: LegalSection[];
}

/**
 * Layout for the legal and information pages. Each opens with a notice that
 * it is a concept document: it describes how this website actually works,
 * but has not been reviewed by a lawyer and names no legal entity.
 */
export function LegalDocument({ path, title, updated, summary, sections }: LegalDocumentProps) {
  return (
    <div className="shell section-space pt-[clamp(2.5rem,1rem+6vw,7rem)]">
      <header className="grid-page">
        <div className="col-span-12 lg:col-span-9">
          <SectionLabel>Information</SectionLabel>
          <h1 className="t-h1 mt-6">{title}</h1>
          <p className="t-small mt-6 text-olive-ink">Last updated {updated}</p>
        </div>
      </header>

      <div className="grid-page mt-[var(--space-block)] gap-y-12">
        <nav aria-label="Legal and information" className="col-span-12 lg:col-span-3">
          <ul className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            {LEGAL_PAGES.map((page) => (
              <li key={page.href} className="rule">
                <Link
                  href={page.href}
                  aria-current={page.href === path ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center py-2 text-[0.9375rem] transition-colors hover:text-charcoal",
                    page.href === path ? "font-medium text-charcoal" : "text-olive-ink",
                  )}
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <aside aria-label="About this document" className="t-small measure-wide border-l-2 border-[var(--line-strong)] pl-5 text-olive-ink">
            <p>
              <span className="font-semibold text-charcoal">Concept document.</span> Linesform Studio is a
              fictional practice created by Midline Seven as a portfolio concept. This page describes how
              this website actually works, but it has not been reviewed by a lawyer and does not name a
              legal entity. A real practice would need to complete and review it before launch.
            </p>
          </aside>

          <div className="t-lead mt-10 measure-wide">{summary}</div>

          <div className="mt-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="rule pt-6 pb-10">
                <h2 id={`${section.id}-heading`} className="t-h3">
                  {section.heading}
                </h2>
                <div className="mt-4 measure-wide space-y-4">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
