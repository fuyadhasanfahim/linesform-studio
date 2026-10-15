import type { Metadata } from "next";
import { Approach } from "@/components/home/approach";
import { ContactSection } from "@/components/home/contact-section";
import { Hero } from "@/components/home/hero";
import { Materials } from "@/components/home/materials";
import { SelectedWork } from "@/components/home/selected-work";
import { StudioIntro } from "@/components/home/studio-intro";
import { site } from "@/content/site";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: { absolute: site.title },
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: site.description,
          creator: { "@type": "Organization", name: site.creator },
        }}
      />
      <Hero />
      <SelectedWork />
      <StudioIntro />
      <Approach />
      <Materials />
      <ContactSection />
    </>
  );
}
