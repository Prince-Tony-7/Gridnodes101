import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { rotationDot } from "@/lib/palette";
import { cn } from "@/lib/cn";

/** Only tools I actually use. n8n itself connects to far more. */
const TOOLS = ["n8n", "Google Sheets", "Excel", "Gmail", "Slack", "OpenAI", "Supabase"];

export function IntegrationsMarquee() {
  return (
    <section aria-label="Tools I work with" className="border-y border-line bg-card py-8">
      <Container>
        <p className="text-center text-xs font-semibold tracking-widest text-ink-mute uppercase">
          n8n connects to 400+ apps. The ones I use most:
        </p>
        <Reveal y={12}>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
            {TOOLS.map((name, i) => (
              <li key={name} className="flex items-center gap-2.5 font-display text-lg font-medium whitespace-nowrap text-ink-soft">
                <span className={cn("h-2 w-2 rounded-full", rotationDot[i % rotationDot.length])} aria-hidden />
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
