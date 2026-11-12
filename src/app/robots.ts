import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/url";

export const dynamic = "force-static";

/**
 * Note: on a GitHub Pages project site this file lives at /Gridnodes101/robots.txt,
 * which crawlers don't read (they only check the domain root). It becomes active
 * with a custom domain. Submit the sitemap in Google Search Console meanwhile.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
