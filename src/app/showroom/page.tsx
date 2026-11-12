import type { Metadata } from "next";
import { Suspense } from "react";
import { ShowroomGallery } from "@/components/showroom/ShowroomGallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllWorkflows } from "@/lib/workflows";
import { absoluteUrl } from "@/lib/url";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/showroom/") },
  title: "Example Workflows",
  description: "Example n8n workflows for small-business admin: client intake, spreadsheet reporting and invoice reminders. Templates, not client deployments.",
};

export default async function ShowroomPage() {
  const workflows = await getAllWorkflows();

  return (
    <Container className="pt-14 pb-8">
      <SectionHeading
        as="h1"
        kicker="Examples"
        kickerClass="bg-coral"
        title="Example workflows."
        description="Templates that show how I approach common small-business admin. They’re examples, not client deployments. Each one has a step-by-step breakdown and n8n JSON you can import."
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
