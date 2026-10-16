import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionLabelProps {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

/** Uppercase label that introduces a section, e.g. "Studio". */
export function SectionLabel({ children, tone = "light", className }: SectionLabelProps) {
  return (
    <p className={cn("t-label", tone === "dark" ? "text-stone" : "text-olive-ink", className)}>
      {children}
    </p>
  );
}
