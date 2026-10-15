import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="shell section-space pt-[clamp(3rem,1rem+8vw,9rem)]">
      <div className="grid-page gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <SectionLabel index="404">Not found</SectionLabel>
          <h1 className="t-h1 mt-6 max-w-[14ch]">This room has not been built.</h1>
          <p className="t-lead mt-6 measure">
            The page you were looking for does not exist or has moved.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <ArrowLink href="/work">See selected work</ArrowLink>
            <ArrowLink href="/">Return home</ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}
