import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description: "Tell us about your manual bottlenecks and we'll map the automation opportunity.",
};

const steps = [
  { title: "We read your intake", body: "Before we meet, we look at your bottleneck and the tools involved.", color: "bg-coral" },
  { title: "45-minute discovery", body: "An engineer maps the process with you and sizes the opportunity.", color: "bg-sun" },
  { title: "A scoped proposal", body: "Fixed scope, architecture sketch, timeline and projected ROI.", color: "bg-mint" },
];

export default function ContactPage() {
  return (
    <Container className="pt-14">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-10">
          <SectionHeading
            as="h1"
            kicker="Discovery call"
            kickerClass="bg-pink"
            title="Where is your team losing hours?"
            description="Tell us about the copy-paste, the exports, the 'quick check' that takes all afternoon. We'll show up with a draft plan."
          />
          <ol className="space-y-4">
            {steps.map(({ title, body, color }, i) => (
              <li key={title} className="flex gap-4">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink font-display text-lg font-extrabold shadow-pop-sm",
                    color,
                  )}
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className="font-display text-lg font-bold text-ink">{title}</p>
                  <p className="mt-0.5 text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
