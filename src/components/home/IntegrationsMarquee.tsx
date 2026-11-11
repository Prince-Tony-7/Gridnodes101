import { INTEGRATIONS } from "@/lib/types";
import { rotation } from "@/lib/palette";
import { cn } from "@/lib/cn";

const EXTRA = ["Airtable", "Gmail", "Salesforce", "Jira", "Shopify", "Zendesk"];
const ITEMS = [...INTEGRATIONS, ...EXTRA];

/** Infinite, gently tilted ticker of the tools we wire together. */
export function IntegrationsMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {ITEMS.map((name, i) => (
        <li
          key={name}
          className={cn(
            "rounded-full border-2 border-ink px-4 py-1.5 font-display text-lg font-bold whitespace-nowrap text-ink",
            rotation[i % rotation.length],
          )}
        >
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Tools we integrate" className="overflow-hidden py-6">
      <div className="-mx-4 -rotate-1 border-y-2 border-ink bg-ink py-4">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
