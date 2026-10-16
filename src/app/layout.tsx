import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ContactAssistant } from "@/components/assistant/contact-assistant";
import { ConsentRoot } from "@/components/consent/consent-root";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { site } from "@/content/site";
import { gtmId } from "@/lib/tracking/config";
import "./globals.css";

/** Search Console HTML-tag verification token (not a tracking ID). Optional. */
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined;

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});

// Italic is used for single accent words and pull quotes only, so it is
// loaded on demand instead of competing with the critical fonts.
const cormorantItalic = Cormorant_Garamond({
  variable: "--font-cormorant-italic",
  subsets: ["latin"],
  style: "italic",
  display: "swap",
  preload: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.creator }],
  creator: site.creator,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#f3f0e9",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${cormorantItalic.variable} ${manrope.variable}`}>
      <body className="flex min-h-svh flex-col bg-limestone text-charcoal">
        <noscript>
          {/* Without JavaScript, show everything that would otherwise reveal on scroll, and every FAQ answer. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-cover]{display:none!important}[data-accordion-panel]{grid-template-rows:1fr!important;visibility:visible!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only z-50 bg-charcoal px-4 py-3 text-limestone focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {/* Only when a GTM container is configured: otherwise there are no optional cookies to ask about. */}
        {gtmId ? <ConsentRoot gtmId={gtmId} /> : null}
        <MotionProvider>
          <SiteHeader items={site.nav} disclosure={site.disclosure} />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
        <ContactAssistant contactEmail={site.contactEmail} />
      </body>
    </html>
  );
}
