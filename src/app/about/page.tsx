import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ContactLinks } from "@/components/about/ContactLinks";
import { Headshot } from "@/components/about/Headshot";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { absoluteUrl } from "@/lib/url";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/about/") },
  title: "About",
  description:
    "GridNodes is Prince Tony, a Dublin-based Manufacturing Process Engineer who builds n8n automations for Irish small businesses.",
};

const PRINCIPLES = [
  {
    title: "Documented",
    body: "Every workflow comes with plain-English notes, so you're never stuck depending on me to understand it.",
  },
  {
    title: "Tested",
    body: "I test against copies of your real files before anything goes live, then run it alongside the old way.",
  },
  {
    title: "Reliable",
    body: "Error alerts are built in, so if something breaks you find out straight away, not at month-end.",
  },
];

export default function AboutPage() {
  return (
    <Container className="pt-14">
      <div className="grid gap-12 md:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
        <Reveal className="mx-auto w-full max-w-[320px] md:mx-0">
          <Headshot />
        </Reveal>

        <div>
          <SectionHeading
            as="h1"
            kicker="About"
            kickerClass="bg-coral"
            title="I'm Prince Tony. I build automations for small businesses."
          />
          <Reveal delay={0.1} className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              By day I&rsquo;m a Manufacturing Process Engineer in regulated medical device manufacturing (MEng, DCU).
              In that world, every process has to be documented, tested and reliable, because it has to work the same
              way every single time.
            </p>
            <p>
              GridNodes is where I apply that same discipline to small businesses. I build n8n workflow automations,
              mainly for Dublin professional-services firms like accountants, solicitors and small practices, that take
              the repetitive admin off people&rsquo;s plates.
            </p>
            <p>
              GridNodes is just me, built in the evenings and at weekends. You deal directly with the person designing
              and building your automation, and I&rsquo;m taking on my first clients now.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-8">
            <ContactLinks />
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">What I work with</p>
            <p className="mt-2 text-ink-soft">
              n8n (self-hosted with Docker), Excel and Google Sheets, Gmail, JavaScript in Function nodes, and Supabase.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="mt-24" aria-labelledby="principles">
        <h2 id="principles" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          How I work
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="pop rounded-card bg-card p-6">
              <p className="text-lg font-semibold text-ink">{p.title}</p>
              <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12">
          <ButtonLink href="/contact">
            Tell me what takes up your time <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </Reveal>
      </section>
    </Container>
  );
}
