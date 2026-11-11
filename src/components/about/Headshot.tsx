import fs from "node:fs";
import path from "node:path";
import { UserRound } from "lucide-react";
import { withBasePath } from "@/lib/basePath";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

/**
 * Prince's photo, or a neutral placeholder until public/images/prince.jpg exists.
 * Checked at build time, so just add the file and redeploy.
 */
export function Headshot({ className }: { className?: string }) {
  const { headshot, name } = siteConfig.owner;
  const exists = fs.existsSync(path.join(process.cwd(), "public", headshot));

  return (
    <div className={cn("pop relative aspect-[4/5] overflow-hidden rounded-card bg-paper-deep", className)}>
      {exists ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimised images
        <img src={withBasePath(headshot)} alt={`Photo of ${name}`} className="h-full w-full object-cover" />
      ) : (
        <div className="bg-dots flex h-full w-full flex-col items-center justify-center gap-3 text-ink-mute" role="img" aria-label={`Photo of ${name} coming soon`}>
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-pop-sm">
            <UserRound className="h-9 w-9" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="text-sm font-medium">Photo coming soon</span>
        </div>
      )}
    </div>
  );
}
