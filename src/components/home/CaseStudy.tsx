import { CheckCircle2, Clock, Hammer, SearchCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * First real case study. Keep it factual: no figures until they are measured.
 *
 * TODO(Prince): fill in the measured before/after time below. Leave both as
 * null until you have real numbers; the "time saved" panel only appears once
 * both are set.
 */
const RESULT_TIME: { before: string | null; after: string | null; unit: string } = {
  before: null, // TODO: e.g. "X hours per month" measured before automation
  after: null, // TODO: e.g. "Y minutes per month" measured after automation
  unit: "spent on billing and exception reports",
};

const BUILT = [
  {
    title: "Exception reports",
    body: "Messy Excel exports are read row by row against agreed rules, and only the rows that need attention end up in the report.",
  },
  {
    title: "Monthly billing workbooks",
    body: "One billing workbook per customer site, built from the raw export each month instead of by hand.",
  },
  {
    title: "Categorised daily sheets",
    body: "Daily data sorted into the right categories automatically, ready for the team to work from.",
  },
];

export function CaseStudy() {
  const hasTimes = RESULT_TIME.before !== null && RESULT_TIME.after !== null;

  return (
    <section id="case-study" className="py-24">
      <Container>
        <SectionHeading
          kicker="Case study"
          kickerClass="bg-coral"
          title="Monthly billing and exception reporting, automated."
          description="Anonymised: a Dublin medical device company. Monthly billing and exception reporting from manual Excel exports, automated with n8n."
        />

        <Reveal className="mt-12" y={24}>
          <div className="pop overflow-hidden rounded-card bg-card">
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-6 py-4 sm:px-8">
              <Badge className="bg-sky-tint text-sky-deep">Medical device manufacturing</Badge>
              <Badge>n8n (self-hosted, Docker)</Badge>
              <Badge>Excel</Badge>
              <Badge>JavaScript Function nodes</Badge>
            </div>

            <div className="grid divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {/* Problem */}
              <div className="p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-mute uppercase">
                  <SearchCheck className="h-4 w-4 text-coral-deep" aria-hidden /> Problem
                </p>
                <p className="mt-4 leading-relaxed text-ink-soft">
                  Billing and reporting depended on raw Excel exports that had to be cleaned, filtered and rebuilt by hand
                  every month. Problem rows had to be found by scanning the whole export, and the same daily data was
                  sorted into categories manually.
                </p>
              </div>

              {/* What I built */}
              <div className="p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-mute uppercase">
                  <Hammer className="h-4 w-4 text-coral-deep" aria-hidden /> What I built
                </p>
                <ul className="mt-4 space-y-4">
                  {BUILT.map((b) => (
                    <li key={b.title}>
                      <p className="font-semibold text-ink">{b.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{b.body}</p>
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
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-mint-deep" aria-hidden />
                    Reports are produced the same way every time, from the same written-down rules.
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-mint-deep" aria-hidden />
                    The manual export-and-rebuild step is gone from the monthly routine.
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-mint-deep" aria-hidden />
                    Each workflow is documented so others can follow and maintain it.
                  </li>
                </ul>

                {hasTimes && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-mint-tint p-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-mint-deep" aria-hidden />
                    <p className="text-sm leading-relaxed text-ink">
                      Time {RESULT_TIME.unit}: <strong>{RESULT_TIME.before}</strong> before,{" "}
                      <strong>{RESULT_TIME.after}</strong> after.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
