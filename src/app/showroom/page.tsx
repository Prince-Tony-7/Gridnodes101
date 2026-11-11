import type { Metadata } from "next";
import { Suspense } from "react";
import { ShowroomGallery } from "@/components/showroom/ShowroomGallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllWorkflows } from "@/lib/workflows";

export const metadata: Metadata = {
  title: "Automation Showroom",
  description: "Search and filter production n8n workflows by department, integration and complexity.",
};

export default async function ShowroomPage() {
  const workflows = await getAllWorkflows();

  return (
    <Container className="pt-14 pb-8">
      <SectionHeading
        as="h1"
        kicker="Showroom"
        kickerClass="bg-coral"
        title="Automation workflow library."
        description="Filter by team, integration or complexity. Each workflow includes a node-by-node breakdown, business impact and importable n8n JSON."
      />
      <div className="mt-10">
        {/* useSearchParams (deep-linked modal) requires a Suspense boundary for static rendering. */}
        <Suspense fallback={<div className="pop h-64 animate-pulse rounded-card bg-paper-deep" />}>
          <ShowroomGallery workflows={workflows} />
        </Suspense>
      </div>
    </Container>
  );
}
