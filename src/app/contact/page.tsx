import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me which repetitive admin job takes up too much of your time, and I'll tell you honestly whether it's worth automating.",
};

const steps = [
  { title: "I read your message", body: "I'll look at the job you describe and the tools involved, and reply within 2 working days.", color: "bg-coral-tint text-coral-deep" },
  { title: "A free, short chat", body: "I'll ask how the job works today. If automation isn't worth it, I'll say so.", color: "bg-sun-tint text-sun-deep" },
  { title: "A clear, fixed quote", body: "What I'll build, how long it'll take and what it costs. No surprises.", color: "bg-mint-tint text-mint-deep" },
];

export default function ContactPage() {
  return (
    <Container className="pt-14">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-10">
          <SectionHeading
            as="h1"
            kicker="Get in touch"
            kickerClass="bg-coral"
            title="What takes up too much of your time?"
            description="Tell me about the spreadsheet, inbox or copy-paste job you’d love to stop doing. No jargon needed, and no obligation."
          />
          <ol className="space-y-4">
            {steps.map(({ title, body, color }, i) => (
              <Reveal as="li" key={title} delay={0.15 + i * 0.1} y={16} className="flex gap-4">
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
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Container>
  );
}
