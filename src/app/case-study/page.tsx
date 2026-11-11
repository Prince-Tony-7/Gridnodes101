import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock, Info, Mail, Send } from "lucide-react";
import { WorkflowCanvas } from "@/components/caseStudy/WorkflowCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { caseStudyOutcomes, caseStudyResultTime, caseStudyTools, caseStudyWorkflows } from "@/data/caseStudyData";

export const metadata: Metadata = {
  title: "Case Study: Billing and Exception Reporting",
  description:
    "Anonymised case study: three n8n workflows that turn manual Excel exports into exception reports, monthly billing workbooks and categorised daily sheets for an Irish medical device company.",
};

export default function CaseStudyPage() {
  const hasTimes = caseStudyResultTime.before !== null && caseStudyResultTime.after !== null;

  return (
    <>
      <Container className="pt-14">
        <SectionHeading
          as="h1"
          kicker="Case study"
          kickerClass="bg-coral"
          title="Billing and exception reporting from Excel exports, automated."
          description="Anonymised: an Irish medical device company. Monthly billing and exception reporting from manual Excel exports, automated with three n8n workflows."
        />

        <Reveal delay={0.1} className="mt-6 flex max-w-3xl items-start gap-2 rounded-lg border border-line bg-card px-4 py-3 text-sm text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-deep" aria-hidden />
          <p>
            I built these for my employer. To protect the company and its customers, names, sites, products, prices and
            data fields are left out, and node labels in the diagrams are generic. The structure of each workflow is real.
          </p>
        </Reveal>

        {/* Problem / approach */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="pop rounded-card bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">The problem</p>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">
              The business system could only give an Excel export. Every month, billing workbooks were rebuilt by hand per
              customer site, problem rows were found by scanning the whole export, and the same daily data was sorted
              into categories manually. Repetitive work that had to be done the same careful way every time.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="pop rounded-card bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">The approach</p>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">
              Keep the way people already work: <strong className="text-ink">email the export to an inbox</strong>. Each
              workflow watches for its Gmail label, checks the file, does the work and{" "}
              <strong className="text-ink">emails the finished workbook back</strong>, or explains exactly why it couldn&rsquo;t.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-coral-tint px-2.5 py-1 text-coral-deep">
                <Mail className="h-4 w-4" aria-hidden /> Email the export
              </span>
              <ArrowRight className="h-4 w-4 text-ink-mute" aria-hidden />
              <span className="rounded-md bg-sun-tint px-2.5 py-1 text-sun-deep">n8n checks and processes it</span>
              <ArrowRight className="h-4 w-4 text-ink-mute" aria-hidden />
              <span className="inline-flex items-center gap-1.5 rounded-md bg-mint-tint px-2.5 py-1 text-mint-deep">
                <Send className="h-4 w-4" aria-hidden /> Workbook comes back
              </span>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* The three workflows */}
      {caseStudyWorkflows.map((wf, i) => (
        <section key={wf.slug} id={wf.slug} className="scroll-mt-24 pt-24" aria-labelledby={`${wf.slug}-title`}>
          <Container>
            <Reveal className="flex flex-wrap items-center gap-2">
              <Badge className="bg-ink text-white">Workflow {i + 1} of 3</Badge>
              <Badge>{wf.nodeCount} nodes</Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id={`${wf.slug}-title`} className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {wf.title}
              </h2>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink-soft">{wf.oneLiner}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-card px-4 py-3">
                <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">Starts when</p>
                <p className="mt-1 text-ink-soft">{wf.trigger}</p>
              </div>
              <div className="rounded-lg border border-line bg-card px-4 py-3">
                <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">Produces</p>
                <p className="mt-1 text-ink-soft">{wf.output}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8">
              <WorkflowCanvas workflow={wf} />
            </Reveal>

            <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {wf.stages.map((stage, si) => (
                <Reveal as="li" key={stage.title} delay={si * 0.05} className="pop rounded-card bg-card p-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-tint font-display text-sm font-semibold text-coral-deep">
                    {si + 1}
                  </span>
                  <p className="mt-4 font-semibold text-ink">{stage.title}</p>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{stage.body}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>
      ))}

      {/* Result */}
      <section className="pt-24" aria-labelledby="result">
        <Container>
          <div className="pop rounded-card bg-card p-6 sm:p-10">
            <h2 id="result" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The result
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {caseStudyOutcomes.map((o) => (
                <li key={o} className="flex gap-3 leading-relaxed text-ink-soft">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-mint-deep" aria-hidden />
                  {o}
                </li>
              ))}
            </ul>

            {hasTimes && (
              <div className="mt-8 flex items-start gap-3 rounded-xl bg-mint-tint p-5">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-mint-deep" aria-hidden />
                <p className="leading-relaxed text-ink">
                  Time {caseStudyResultTime.unit}: <strong>{caseStudyResultTime.before}</strong> before,{" "}
                  <strong>{caseStudyResultTime.after}</strong> after.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">Built with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {caseStudyTools.map((t) => (
                  <li key={t}>
                    <Badge>{t}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Reveal className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <ButtonLink href="/contact">
              Have a spreadsheet job like this? <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/showroom" variant="secondary">
              See example workflows
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
