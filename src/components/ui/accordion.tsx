"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * WAI-ARIA accordion: each question is a <button> inside a heading, with
 * aria-expanded and aria-controls; each answer is a labelled region.
 * Several answers may be open at once. Up/Down/Home/End move between
 * questions. Collapsed answers are visibility:hidden, so they leave the tab
 * order and the accessibility tree; without JavaScript the root layout's
 * <noscript> rule shows every answer.
 */
export function Accordion({ items, headingLevel: Heading = "h3" }: { items: AccordionItem[]; headingLevel?: "h3" | "h4" }) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function toggle(id: string) {
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const target =
      event.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  }

  return (
    <div className="border-b border-[var(--line)]">
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="rule">
            <Heading className="t-h3 font-normal">
              <button
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left focus-visible:outline-offset-2"
              >
                <span className="transition-colors duration-300 group-hover:text-olive-ink">{item.question}</span>
                <span aria-hidden="true" className="relative block h-3.5 w-3.5 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
                  <span
                    data-open={isOpen || undefined}
                    className="absolute top-1/2 left-0 h-px w-full rotate-90 bg-current transition-transform duration-500 ease-architectural data-[open]:rotate-0 motion-reduce:transition-none"
                  />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              data-open={isOpen || undefined}
              data-accordion-panel=""
              className="accordion-panel"
            >
              <div>
                <p className="measure-wide pb-7 text-olive-ink">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
