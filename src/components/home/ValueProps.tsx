import { Gauge, ShieldCheck, Code2, LineChart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const props = [
  {
    icon: ShieldCheck,
    title: "Hardened by default",
    body: "Global error workflows, idempotent upserts, retries with backoff and least-privilege credentials on every build.",
  },
  {
    icon: Gauge,
    title: "Built for throughput",
    body: "Queue-mode n8n on Redis + Postgres, horizontally scaled workers and rate-limit aware batching.",
  },
  {
    icon: LineChart,
    title: "ROI you can audit",
    body: "Every workflow ships with baseline metrics, execution logging and a business-value dashboard.",
  },
  {
    icon: Code2,
    title: "Yours to own",
    body: "Version-controlled JSON, documented nodes and a handover runbook — no black boxes, no lock-in.",
  },
];

export function ValueProps() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Why GridNodes"
          title="Automation engineered like software, not stitched together."
          description="Low-code doesn't mean low standards. We bring software-engineering rigor to every canvas."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {props.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-card border border-line bg-surface/60 p-6 shadow-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent/25 bg-accent-soft text-accent-strong">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-fg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
