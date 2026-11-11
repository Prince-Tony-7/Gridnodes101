import type { Metadata } from "next";
import { DemoTheater } from "@/components/demos/DemoTheater";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllDemos } from "@/lib/demos";

export const metadata: Metadata = {
  title: "Demo Videos",
  description: "Watch GridNodes n8n automations running end to end, from trigger to outcome.",
};

export default async function DemosPage() {
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
