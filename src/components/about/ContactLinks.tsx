import { Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** LinkedIn, email and location, used on the About page and teaser. */
export function ContactLinks({ className }: { className?: string }) {
  const { email, linkedin, location } = siteConfig.owner;
  const item = "inline-flex min-h-11 items-center gap-2 text-sm font-medium";
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-1", className)}>
      <li>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={cn(item, "text-ink hover:text-coral-deep")}>
          <LinkedinIcon className="h-4 w-4" /> LinkedIn
        </a>
      </li>
      <li>
        <a href={`mailto:${email}`} className={cn(item, "text-ink hover:text-coral-deep")}>
          <Mail className="h-4 w-4" aria-hidden /> {email}
        </a>
      </li>
      <li className={cn(item, "text-ink-soft")}>
        <MapPin className="h-4 w-4" aria-hidden /> {location}
      </li>
    </ul>
  );
}
