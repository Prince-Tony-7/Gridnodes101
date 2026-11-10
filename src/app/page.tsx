import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { MetricsRibbon } from "@/components/home/MetricsRibbon";
import { ValueProps } from "@/components/home/ValueProps";
import { WorkflowCard } from "@/components/showroom/WorkflowCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { globalMetrics } from "@/data/workflowsData";
import { getAllWorkflows } from "@/lib/workflows";

export default async function HomePage() {
  const workflows = await getAllWorkflows();

  return (
    <>
      <Hero />
      <MetricsRibbon metrics={globalMetrics} />

      <section className="pt-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured automations"
              title="Battle-tested workflows, ready to adapt."
              description="A sample of the systems we've shipped for revenue, finance and content teams."
            />
            <ButtonLink href="/showroom" variant="secondary" className="shrink-0">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workflows.slice(0, 3).map((w) => (
              <li key={w.slug}>
                <WorkflowCard workflow={w} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ValueProps />
    </>
  );
}
