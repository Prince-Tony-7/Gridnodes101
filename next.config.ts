import type { NextConfig } from "next";

/**
 * Static export so the site can be hosted on GitHub Pages (or any static host).
 *
 * BASE_PATH is set by the Pages workflow (e.g. "/Gridnodes101" for a project
 * site). Leave it unset for local dev or when serving from a domain root.
 */
const basePath = process.env.BASE_PATH?.replace(/\/$/, "") || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Exposed so plain <video>/<img> tags (which Next does not rewrite) can prefix it.
  env: { NEXT_PUBLIC_BASE_PATH: basePath ?? "" },
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
