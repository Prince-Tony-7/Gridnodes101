import { ArrowRight } from "lucide-react";
import { DemoTheater } from "@/components/demos/DemoTheater";
import { Hero } from "@/components/home/Hero";
import { IntegrationsMarquee } from "@/components/home/IntegrationsMarquee";
import { MetricsRibbon } from "@/components/home/MetricsRibbon";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Reveal } from "@/components/motion/Reveal";
import { ValueProps } from "@/components/home/ValueProps";
import { WorkflowCard } from "@/components/showroom/WorkflowCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { globalMetrics } from "@/data/workflowsData";
import { getAllDemos } from "@/lib/demos";
import { getAllWorkflows } from "@/lib/workflows";

export default async function HomePage() {
  const [workflows, demos] = await Promise.all([getAllWorkflows(), getAllDemos()]);

  return (
    <>
      <Hero />
      <IntegrationsMarquee />
      <MetricsRibbon metrics={globalMetrics} />

      <section className="pt-20 pb-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              kicker="Selected work"
              kickerClass="bg-coral"
              title="Workflows running in production."
              description="Representative builds for sales, finance and marketing teams. Open any workflow to see its architecture, ROI and importable JSON."
            />
            <Reveal delay={0.1} className="shrink-0">
              <ButtonLink href="/showroom" variant="secondary">
                View all workflows <ArrowRight className="h-4 w-4" aria-hidden />
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

      <ProcessTimeline />
      <ValueProps />
    </>
  );
}
