import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/url";

export const dynamic = "force-static";

/** All public pages. Demos is only listed when the feature is switched on. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/case-study/", priority: 0.9 },
    { path: "/showroom/", priority: 0.7 },
    { path: "/about/", priority: 0.8 },
    { path: "/contact/", priority: 0.9 },
    { path: "/privacy/", priority: 0.2 },
  ];
  if (siteConfig.features.demos) pages.push({ path: "/demos/", priority: 0.6 });
  return pages.map(({ path, priority }) => ({ url: absoluteUrl(path), changeFrequency: "monthly", priority }));
}
