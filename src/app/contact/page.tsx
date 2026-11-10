import { CalendarClock, ClipboardList, Rocket } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description: "Tell us about your manual bottlenecks and we'll map the automation opportunity.",
};

const steps = [
  { icon: ClipboardList, title: "Intake review", body: "We review your bottleneck and current tool stack before we meet." },
  { icon: CalendarClock, title: "45-min discovery", body: "A solutions engineer maps the process and quantifies the opportunity." },
  { icon: Rocket, title: "Scoped proposal", body: "Fixed-scope plan with architecture, timeline and projected ROI." },
];

export default function ContactPage() {
  return (
    <Container className="pt-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-10">
          <SectionHeading
            as="h1"
            eyebrow="Discovery booking"
            title="Let's find your highest-ROI automation."
            description="Share where your team loses time today. We'll come to the call with a draft architecture."
          />
          <ol className="space-y-6">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-logic/30 bg-logic-soft text-logic-strong">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-mono text-[11px] text-fg-subtle">STEP {i + 1}</p>
                  <p className="font-medium text-fg">{title}</p>
                  <p className="mt-1 text-sm text-fg-muted">{body}</p>
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
