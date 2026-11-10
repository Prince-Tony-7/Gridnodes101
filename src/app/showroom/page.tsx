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
    <Container className="pt-16 pb-8">
      <SectionHeading
        as="h1"
        eyebrow="Automation Showroom"
        title="Explore production n8n workflows"
        description="Filter by department, integration or complexity. Open any workflow for a node-by-node breakdown, ROI data, technical specs and importable JSON."
      />
      <div className="mt-10">
        {/* useSearchParams (deep-linked modal) requires a Suspense boundary for static rendering. */}
        <Suspense fallback={<div className="h-64 animate-pulse rounded-card border border-line bg-surface/40" />}>
          <ShowroomGallery workflows={workflows} />
        </Suspense>
      </div>
    </Container>
  );
}
