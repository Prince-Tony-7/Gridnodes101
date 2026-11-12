import "@fontsource-variable/inter-tight";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { siteConfig } from "@/lib/site";

/**
 * Content Security Policy. GitHub Pages can't send HTTP headers, so this is
 * delivered as a <meta> tag (production builds only: the dev server needs eval).
 * Only the site itself, the Apps Script enquiry endpoint (which redirects to
 * googleusercontent.com) and, for demo videos, the three video hosts are allowed.
 */
const CSP = [
  "default-src 'self'",
  // Next.js static export bootstraps with inline scripts.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://script.google.com https://script.googleusercontent.com",
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.loom.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

export const metadata: Metadata = {
  // Absolute base for share-image URLs. Set SITE_URL when moving to a custom domain.
  metadataBase: new URL(process.env.SITE_URL ?? "https://prince-tony-7.github.io"),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  authors: [{ name: siteConfig.owner.name, url: siteConfig.owner.linkedin }],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_IE",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IE">
      <head>
        {process.env.NODE_ENV === "production" && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
        {/* Without JavaScript, scroll-reveal animations never run: show that content anyway. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
