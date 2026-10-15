import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionLabelProps {
  index?: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

/** Numbered uppercase label that introduces a section, e.g. "02 — Studio". */
export function SectionLabel({ index, children, tone = "light", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "t-label flex items-center gap-3",
        tone === "dark" ? "text-stone" : "text-olive-ink",
        className,
      )}
    >
      {index ? (
        <>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
