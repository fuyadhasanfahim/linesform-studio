import type { Metadata } from "next";
import { Approach } from "@/components/home/approach";
import { ContactSection } from "@/components/home/contact-section";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { Materials } from "@/components/home/materials";
import { SelectedWork } from "@/components/home/selected-work";
import { StudioIntro } from "@/components/home/studio-intro";
import { Testimonials } from "@/components/home/testimonials";
import { pageUrls, publishAbsoluteUrls, site } from "@/content/site";
import { JsonLd } from "@/lib/json-ld";

const urls = pageUrls("/");

export const metadata: Metadata = {
  title: { absolute: site.title },
  alternates: urls.alternates,
  openGraph: urls.openGraphUrl,
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          ...(publishAbsoluteUrls ? { url: site.url } : {}),
          description: site.description,
          creator: { "@type": "Organization", name: site.creator, url: site.creatorUrl },
        }}
      />
      <Hero />
      <SelectedWork />
      <Testimonials />
      <StudioIntro />
      <Approach />
      <Materials />
      <FaqSection />
      <ContactSection />
    </>
  );
}
