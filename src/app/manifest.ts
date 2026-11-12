import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { BASE_PATH } from "@/lib/url";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "browser",
    background_color: "#f6f4ee",
    theme_color: "#0b3d2e",
    icons: [
      { src: `${BASE_PATH}/icon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${BASE_PATH}/apple-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  };
}
