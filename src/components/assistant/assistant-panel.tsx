"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { faq } from "@/content/studio";
import { cn } from "@/lib/cn";
import { ctaAttributes } from "@/lib/tracking/cta";

/** Questions the assistant can answer, reusing the FAQ copy so answers never drift apart. */
const TOPICS = ["project-types", "enquiry-contents", "timelines-budgets", "locations"]
  .map((id) => faq.items.find((item) => item.id === id))
  .filter((item) => item !== undefined);

interface Message {
  from: "studio" | "visitor";
  text: string;
}

const GREETING: Message = {
  from: "studio",
  text: "Hello. Choose a question below, or go straight to the project enquiry form.",
};

const actionClass =
  "flex min-h-11 w-full items-center justify-between gap-4 border-t border-[var(--line)] py-2.5 text-left text-[0.9375rem] transition-colors duration-200 hover:text-olive-ink";

interface AssistantPanelProps {
  id: string;
  contactEmail?: string;
  onClose: (options?: { restoreFocus?: boolean }) => void;
}

/**
 * The assistant's panel, loaded only when it is first opened so its code and
 * copy never weigh on the initial page load.
 */
export function AssistantPanel({ id, contactEmail, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [asked, setAsked] = useState<ReadonlySet<string>>(() => new Set());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const latestQuestionRef = useRef<HTMLParagraphElement>(null);
  const headingId = useId();
  const noteId = useId();

  // Focus the title first so its purpose and the "not live chat" note are read.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Bring the newest question and its answer into view, from the top.
  useEffect(() => {
    const body = bodyRef.current;
    const question = latestQuestionRef.current;
    if (body && question) body.scrollTop = question.offsetTop - 16;
  }, [messages]);

  function ask(topic: (typeof TOPICS)[number]) {
    setAsked((previous) => new Set(previous).add(topic.id));
    setMessages((previous) => [
      ...previous,
      { from: "visitor", text: topic.question },
      { from: "studio", text: topic.answer },
    ]);
  }

  const leave = () => onClose({ restoreFocus: false });

  return (
    <section
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      aria-describedby={noteId}
      className="assistant-panel fixed right-3 bottom-[4.5rem] z-40 flex max-h-[min(34rem,calc(100dvh-var(--header-height)-7rem))] w-[min(23rem,calc(100vw-1.5rem))] flex-col border border-[var(--line-strong)] bg-limestone text-charcoal shadow-[0_24px_60px_-30px_rgb(37_39_34/0.5)] sm:right-5"
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-5">
        <div>
          <h2 id={headingId} ref={headingRef} tabIndex={-1} className="t-label text-charcoal focus:outline-none">
            Contact assistant
          </h2>
          <p id={noteId} className="t-small mt-2 text-olive-ink">
            Not live chat — no one is reading here. Answers are prepared in advance, and nothing you
            choose is sent anywhere.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onClose()}
          className="-mt-1.5 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center"
          aria-label="Close contact assistant"
        >
          <span aria-hidden="true" className="relative block h-3.5 w-3.5">
            <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div ref={bodyRef} className="relative mt-4 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
        <div role="log" aria-live="polite" className="space-y-3">
          {messages.map((message, index) => (
            <p
              key={index}
              ref={message.from === "visitor" && index === messages.length - 2 ? latestQuestionRef : undefined}
              className={cn(
                "t-small max-w-[88%] px-3.5 py-2.5",
                message.from === "studio" ? "bg-limestone-deep" : "ml-auto bg-charcoal text-limestone",
              )}
            >
              <span className="sr-only">{message.from === "studio" ? "Answer: " : "You asked: "}</span>
              {message.text}
            </p>
          ))}
        </div>

        {/* Asked questions stay in place (muted) so keyboard focus is never lost. */}
        <ul aria-label="Questions" className="mt-5">
          {TOPICS.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className={cn(actionClass, asked.has(topic.id) && "text-olive-ink")}
                onClick={() => ask(topic)}
              >
                {topic.question}
                {asked.has(topic.id) ? <span className="sr-only"> (answered above)</span> : null}
              </button>
            </li>
          ))}
        </ul>

        <ul aria-label="Go to" className="mt-4 grid grid-cols-1 gap-2">
          <li>
            <Link
              href="/#contact"
              onClick={leave}
              {...ctaAttributes({ id: "start_project", location: "assistant" })}
              className="flex min-h-11 items-center justify-center bg-charcoal px-4 text-[0.875rem] font-medium text-limestone transition-colors duration-300 hover:bg-olive-ink focus-visible:outline-charcoal"
            >
              Start a project
            </Link>
          </li>
          <li className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-[0.875rem]">
            <Link href="/#faq" onClick={leave} className="link-draw py-1.5">
              All questions
            </Link>
            <Link href="/work" onClick={leave} className="link-draw py-1.5">
              Selected work
            </Link>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="link-draw py-1.5">
                Email the studio
              </a>
            ) : null}
          </li>
        </ul>
      </div>
    </section>
  );
}
