import { ArrowRight } from "lucide-react";
import { ContactLinks } from "@/components/about/ContactLinks";
import { Headshot } from "@/components/about/Headshot";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutTeaser() {
  return (
    <section className="pb-8">
      <Container className="grid items-center gap-10 md:grid-cols-[minmax(0,280px)_1fr] lg:gap-16">
        <Reveal className="mx-auto w-full max-w-[280px]">
          <Headshot />
        </Reveal>
        <div>
          <SectionHeading
            kicker="Who you'll work with"
            kickerClass="bg-coral"
            title="Hi, I'm Prince."
            description="I'm a Manufacturing Process Engineer in regulated medical device manufacturing, where every process has to be documented, tested and reliable. GridNodes is where I bring that same discipline to small businesses. It's just me, so you deal directly with the person building your automation."
          />
          <Reveal delay={0.1} className="mt-6">
            <ContactLinks />
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <ButtonLink href="/about" variant="secondary">
              More about me <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
