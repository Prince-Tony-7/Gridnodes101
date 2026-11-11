import { INTEGRATIONS } from "@/lib/types";
import { rotationDot } from "@/lib/palette";
import { cn } from "@/lib/cn";

const EXTRA = ["Airtable", "Gmail", "Salesforce", "Jira", "Shopify", "Zendesk"];
const ITEMS = [...INTEGRATIONS, ...EXTRA];

/** Slow, infinite ticker of the tools we connect. */
export function IntegrationsMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {ITEMS.map((name, i) => (
        <li key={name} className="flex items-center gap-2.5 font-display text-lg font-medium whitespace-nowrap text-ink-soft">
          <span className={cn("h-2 w-2 rounded-full", rotationDot[i % rotationDot.length])} aria-hidden />
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Tools we integrate" className="border-y border-line bg-card py-8">
      <p className="text-center text-xs font-semibold tracking-widest text-ink-mute uppercase">
        Connecting the tools your teams already use
      </p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
