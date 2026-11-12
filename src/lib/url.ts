/**
 * Absolute URLs for canonical links, the sitemap and structured data.
 * SITE_URL (origin) and BASE_PATH are set at build time; see next.config.ts.
 * When moving to a custom domain, set SITE_URL and leave BASE_PATH empty.
 */
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prince-tony-7.github.io";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** e.g. absoluteUrl("/about/") -> "https://prince-tony-7.github.io/Gridnodes101/about/" */
export function absoluteUrl(path = "/"): string {
  return `${SITE_ORIGIN}${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
