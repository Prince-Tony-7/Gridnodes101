import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DemoTheater } from "@/components/demos/DemoTheater";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { CaseStudy } from "@/components/home/CaseStudy";
import { Hero } from "@/components/home/Hero";
import { IntegrationsMarquee } from "@/components/home/IntegrationsMarquee";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Services } from "@/components/home/Services";
import { ValueProps } from "@/components/home/ValueProps";
import { Reveal } from "@/components/motion/Reveal";
import { WorkflowCard } from "@/components/showroom/WorkflowCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllDemos } from "@/lib/demos";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/url";
import { getAllWorkflows } from "@/lib/workflows";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

/** Structured data so search engines understand who GridNodes is and where it operates. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon.svg"),
  image: absoluteUrl("/opengraph-image.png"),
  description: siteConfig.description,
  email: siteConfig.owner.email,
  areaServed: { "@type": "Country", name: "Ireland" },
  address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
  founder: { "@type": "Person", name: siteConfig.owner.name, sameAs: [siteConfig.owner.linkedin] },
  sameAs: [siteConfig.owner.linkedin],
  knowsAbout: ["n8n", "Workflow automation", "Google Sheets", "Excel", "Gmail automation"],
};

export default async function HomePage() {
  const [workflows, demos] = await Promise.all([getAllWorkflows(), getAllDemos()]);

  return (
    <>
      <script
        type="application/ld+json"
        // Static data only; "<" is escaped so the JSON can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <IntegrationsMarquee />
      <Services />
      <CaseStudy />

      <section className="pb-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              kicker="Example builds"
              kickerClass="bg-coral"
              title="Example workflows."
              description="Templates that show how I'd approach common admin jobs. They're examples, not client deployments. Open one to see each step and the n8n JSON."
            />
            <Reveal delay={0.1} className="shrink-0">
              <ButtonLink href="/showroom" variant="secondary">
                All examples <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {workflows.slice(0, 3).map((w, i) => (
              <Reveal as="li" key={w.slug} delay={i * 0.1} y={40}>
                <WorkflowCard workflow={w} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Demos are hidden until recordings exist. Turn on with siteConfig.features.demos in src/lib/site.ts. */}
      {siteConfig.features.demos && (
        <section className="pb-28">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                kicker="See it running"
                kickerClass="bg-coral"
                title="Watch the workflows in action."
                description="Short screen recordings of each automation, from the trigger firing to the result landing in your tools."
              />
              <Reveal delay={0.1} className="shrink-0">
                <ButtonLink href="/demos" variant="secondary">
                  All demos <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </Reveal>
            </div>
            <Reveal className="mt-12" delay={0.1}>
              <DemoTheater demos={demos.slice(0, 4)} />
            </Reveal>
          </Container>
        </section>
      )}

      <ProcessTimeline />
      <ValueProps />
      <AboutTeaser />
    </>
  );
}
