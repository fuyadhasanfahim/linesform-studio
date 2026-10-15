import { cn } from "@/lib/cn";

export function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-baseline gap-2.5">
      <span className="font-display text-[1.65rem] leading-none tracking-[-0.015em]">
        Linesform
      </span>
      <span
        className={cn("t-label text-[0.6875rem]", inverse ? "text-stone" : "text-olive-ink")}
      >
        Studio
      </span>
    </span>
  );
}
