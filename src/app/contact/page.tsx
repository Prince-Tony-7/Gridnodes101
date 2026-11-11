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
  { title: "We read your intake", body: "Before we meet, we look at your bottleneck and the tools involved.", color: "bg-coral-tint text-coral-deep" },
  { title: "45-minute discovery", body: "An engineer maps the process with you and sizes the opportunity.", color: "bg-sun-tint text-sun-deep" },
  { title: "A scoped proposal", body: "Fixed scope, architecture sketch, timeline and projected ROI.", color: "bg-mint-tint text-mint-deep" },
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
            title="Let’s find where your team is losing hours."
            description="Share the manual processes slowing your team down. We’ll review them before we meet and arrive with a draft automation plan."
          />
          <ol className="space-y-4">
            {steps.map(({ title, body, color }, i) => (
              <li key={title} className="flex gap-4">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold",
                    color,
                  )}
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className="font-semibold text-ink">{title}</p>
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
