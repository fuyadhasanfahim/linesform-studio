"use client";

import { useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { AssetImage } from "@/components/media/asset-image";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionLabel } from "@/components/ui/section-label";
import { lightStudy } from "@/content/studio";

const SIZES = "(min-width: 108rem) 84rem, (min-width: 64rem) 82vw, 100vw";
/** Movement needed before a touch counts as a sideways drag or a scroll. */
const INTENT_PX = 8;

/**
 * The same view of the Reading Pavilion in afternoon light and at dusk,
 * divided by a line the visitor can move. The image can be dragged
 * sideways (vertical swipes still scroll the page); the slider beneath it
 * does the same for keyboard and assistive technology. Nothing moves on
 * its own.
 */
export function LightStudy() {
  const [position, setPosition] = useState(50);
  const drag = useRef<{ x: number; y: number; sideways: boolean } | null>(null);
  const sliderId = useId();

  function moveTo(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    setPosition(Math.round(Math.min(1, Math.max(0, ratio)) * 100));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const mouse = event.pointerType === "mouse";
    drag.current = { x: event.clientX, y: event.clientY, sideways: mouse };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (mouse) moveTo(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current) return;
    // A touch may be the start of a scroll: the line moves only once the
    // gesture is clearly sideways, and a mostly vertical one is left to the page.
    if (!current.sideways) {
      const dx = Math.abs(event.clientX - current.x);
      const dy = Math.abs(event.clientY - current.y);
      if (Math.max(dx, dy) < INTENT_PX) return;
      if (dy >= dx) {
        drag.current = null;
        return;
      }
      current.sideways = true;
    }
    moveTo(event);
  }

  function stopDragging() {
    drag.current = null;
  }

  return (
    <section aria-labelledby="light-study-heading" className="shell pb-[var(--space-section)]">
      <div className="grid-page items-end gap-y-6">
        <Reveal className="col-span-12 lg:col-span-6 lg:col-start-2">
          <SectionLabel>{lightStudy.label}</SectionLabel>
          <h2 id="light-study-heading" className="t-h2 mt-6 max-w-[14ch]">
            {lightStudy.heading}
          </h2>
        </Reveal>
        <Reveal className="col-span-12 lg:col-span-4 lg:col-start-8" delay={0.1}>
          <p className="measure text-olive-ink">{lightStudy.body}</p>
        </Reveal>
      </div>

      <Reveal className="grid-page mt-[var(--space-block)]">
        <figure className="col-span-12 lg:col-span-10 lg:col-start-2">
          <div
            className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none sm:aspect-[3/2]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            // Images are draggable by default; a native drag would cancel the pointer stream.
            onDragStart={(event) => event.preventDefault()}
          >
            <AssetImage id={lightStudy.after.asset} aspect="fill" sizes={SIZES} />
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <AssetImage id={lightStudy.before.asset} aspect="fill" sizes={SIZES} />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-limestone"
              style={{ left: `${position}%` } as CSSProperties}
            >
              <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-limestone bg-charcoal/40 text-limestone backdrop-blur-sm">
                <svg viewBox="0 0 24 10" className="h-2.5 w-6" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 1 2 5l4 4M18 1l4 4-4 4M2 5h20" />
                </svg>
              </span>
            </div>

            <span
              aria-hidden="true"
              className="t-label pointer-events-none absolute top-4 left-4 bg-limestone px-2.5 py-1.5 text-charcoal"
            >
              {lightStudy.before.label}
            </span>
            <span
              aria-hidden="true"
              className="t-label pointer-events-none absolute top-4 right-4 bg-charcoal px-2.5 py-1.5 text-limestone"
            >
              {lightStudy.after.label}
            </span>
          </div>

          {/* The thumb sits under the dividing line: left of it is afternoon, right of it dusk. */}
          <div className="mt-4">
            <label htmlFor={sliderId} className="t-label text-olive-ink">
              Compare afternoon and dusk
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-valuetext={`${position}% ${lightStudy.before.label.toLowerCase()}, ${100 - position}% ${lightStudy.after.label.toLowerCase()}`}
              className="mt-1 block h-11 w-full cursor-pointer accent-charcoal"
            />
          </div>

          <figcaption className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="t-small text-olive-ink">{lightStudy.caption}</span>
            <ArrowLink
              href={`/work/${lightStudy.project}`}
              className="shrink-0 self-start"
              cta={{ id: "read_project", location: "light_study" }}
            >
              Read the project
            </ArrowLink>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
