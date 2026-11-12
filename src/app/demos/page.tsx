import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoTheater } from "@/components/demos/DemoTheater";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllDemos } from "@/lib/demos";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/url";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/demos/") },
  // Keep the page out of search results while the feature is switched off.
  robots: { index: siteConfig.features.demos, follow: true },
  title: "Demo Videos",
  description: "Screen recordings of GridNodes example automations running end to end.",
};

export default async function DemosPage() {
  // Hidden until recordings exist: set siteConfig.features.demos = true in src/lib/site.ts.
  if (!siteConfig.features.demos) notFound();
  const demos = await getAllDemos();
  return (
    <Container className="pt-14 pb-8">
      <SectionHeading
        as="h1"
        kicker="Demos"
        kickerClass="bg-coral"
        title="See the automations running."
        description="Short walkthroughs of real builds: what triggers each workflow, what happens at every step and what lands at the end."
      />
      <Reveal className="mt-10" delay={0.1}>
        <DemoTheater demos={demos} showFilters />
      </Reveal>
    </Container>
  );
}
