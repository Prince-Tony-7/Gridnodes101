import { ArrowRight, CheckCircle2, Clock, Hammer, SearchCheck } from "lucide-react";
import { WorkflowCanvas } from "@/components/caseStudy/WorkflowCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { caseStudyOutcomes, caseStudyResultTime, caseStudyWorkflows } from "@/data/caseStudyData";

/** Home-page summary of the first real case study; the full write-up lives at /case-study. */
export function CaseStudy() {
  const hasTimes = caseStudyResultTime.before !== null && caseStudyResultTime.after !== null;
  const preview = caseStudyWorkflows.find((w) => w.slug === "monthly-billing") ?? caseStudyWorkflows[0]!;

  return (
    <section id="case-study" className="py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Case study"
            kickerClass="bg-coral"
            title="Monthly billing and exception reporting, automated."
            description="Anonymised: an Irish medical device company. Monthly billing and exception reporting from manual Excel exports, automated with n8n."
          />
          <Reveal delay={0.1} className="shrink-0">
            <ButtonLink href="/case-study" variant="secondary">
              Read the case study <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal className="mt-12" y={24}>
          <div className="pop overflow-hidden rounded-card bg-card">
            <div className="grid divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {/* Problem */}
              <div className="p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-mute uppercase">
                  <SearchCheck className="h-4 w-4 text-coral-deep" aria-hidden /> Problem
                </p>
                <p className="mt-4 leading-relaxed text-ink-soft">
                  Billing and reporting depended on raw Excel exports that were cleaned, checked and rebuilt by hand every
                  month, per customer site. Problem rows had to be found by scanning the whole export.
                </p>
              </div>

              {/* What I built */}
              <div className="p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-mute uppercase">
                  <Hammer className="h-4 w-4 text-coral-deep" aria-hidden /> What I built
                </p>
                <ul className="mt-4 space-y-4">
                  {caseStudyWorkflows.map((w) => (
                    <li key={w.slug}>
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                        {w.title} <Badge>{w.nodeCount} nodes</Badge>
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{w.oneLiner}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Result */}
              <div className="p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-mute uppercase">
                  <CheckCircle2 className="h-4 w-4 text-coral-deep" aria-hidden /> Result
                </p>
                <ul className="mt-4 space-y-3 text-ink-soft">
                  {caseStudyOutcomes.slice(0, 3).map((o) => (
                    <li key={o} className="flex gap-2.5">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-mint-deep" aria-hidden />
                      {o}
                    </li>
                  ))}
                </ul>

                {hasTimes && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-mint-tint p-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-mint-deep" aria-hidden />
                    <p className="text-sm leading-relaxed text-ink">
                      Time {caseStudyResultTime.unit}: <strong>{caseStudyResultTime.before}</strong> before,{" "}
                      <strong>{caseStudyResultTime.after}</strong> after.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8" delay={0.1}>
          <WorkflowCanvas workflow={preview} compact />
        </Reveal>
      </Container>
    </section>
  );
}
