"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { FileSearch, Hammer, LifeBuoy, ShieldCheck, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

interface Step {
  icon: LucideIcon;
  week: string;
  title: string;
  body: string;
  deliverables: string[];
  accent: string;
  soft: string;
}

const STEPS: Step[] = [
  {
    icon: FileSearch,
    week: "Week 1",
    title: "Discovery and baseline",
    body: "We map the current process with the people who run it, measure how long it really takes and agree on the success metric.",
    deliverables: ["Process map", "Baseline metrics", "Fixed-scope proposal"],
    accent: "bg-coral",
    soft: "bg-coral-tint text-coral-deep",
  },
  {
    icon: Hammer,
    week: "Weeks 2–3",
    title: "Build in a staging workspace",
    body: "Workflows are built against sandbox credentials, with every node named, documented and versioned in Git.",
    deliverables: ["n8n workflows", "Test fixtures", "Weekly demo"],
    accent: "bg-violet",
    soft: "bg-violet-tint text-violet-deep",
  },
  {
    icon: ShieldCheck,
    week: "Week 4",
    title: "Harden and launch",
    body: "Error workflows, retries, idempotency keys and alerting go in before anything touches production data.",
    deliverables: ["Error handling", "Monitoring", "Go-live checklist"],
    accent: "bg-sky",
    soft: "bg-sky-tint text-sky-deep",
  },
  {
    icon: LifeBuoy,
    week: "Ongoing",
    title: "Hand over and support",
    body: "Your team gets a runbook and a walkthrough. We report ROI against the baseline and stay on call if you want us.",
    deliverables: ["Runbook", "ROI report", "Optional support plan"],
    accent: "bg-mint",
    soft: "bg-mint-tint text-mint-deep",
  },
];

/**
 * Delivery process as a pipeline: a rail fills as the visitor scrolls and each
 * step "runs" (lights up) when the fill reaches its node.
 */
export function ProcessTimeline() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const isActive = (i: number) => reduce || progress >= i / (STEPS.length - 1) - 0.08;

  return (
    <section className="py-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            kicker="How we deliver"
            kickerClass="bg-violet"
            title="From first call to production in four weeks."
            description="A fixed, transparent process. You see working automations every week, and nothing goes live without error handling and monitoring in place."
          />
          <div className="mt-8 hidden items-center gap-3 text-sm text-ink-mute lg:flex" aria-hidden>
            <span className="font-mono tabular-nums">
              {String(STEPS.filter((_, i) => isActive(i)).length).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
            <span className="h-px w-24 overflow-hidden bg-line">
              <motion.span className="block h-full origin-left bg-ink" style={{ scaleX: reduce ? 1 : fill }} />
            </span>
            <span>steps complete</span>
          </div>
        </div>

        <ol ref={listRef} className="relative space-y-6">
          {/* rail */}
          <span className="absolute top-2 bottom-2 left-[19px] w-px bg-line-strong" aria-hidden />
          <motion.span
            className="absolute top-2 bottom-2 left-[18px] w-[3px] origin-top rounded-full"
            style={{
              scaleY: reduce ? 1 : fill,
              background: "linear-gradient(180deg, var(--color-coral), var(--color-violet), var(--color-sky), var(--color-mint))",
            }}
            aria-hidden
          />

          {STEPS.map((step, i) => {
            const active = isActive(i);
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative flex gap-6">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
                  <motion.span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500",
                      active ? cn(step.accent, "border-transparent text-white") : "border-line-strong bg-card text-ink-mute",
                    )}
                    animate={active && !reduce ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                  </motion.span>
                  {active && !reduce && (
                    <motion.span
                      key="pulse"
                      className={cn("absolute inset-0 rounded-full", step.accent)}
                      initial={{ opacity: 0.45, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.9 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      aria-hidden
                    />
                  )}
                </span>

                <div
                  className={cn(
                    "pop flex-1 rounded-card bg-card p-6 transition-[opacity,transform] duration-500",
                    active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-45",
                  )}
                >
                  <p className="text-xs font-semibold tracking-wider text-ink-mute uppercase">{step.week}</p>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {step.deliverables.map((d) => (
                      <li key={d} className={cn("rounded-md px-2 py-0.5 text-xs font-medium", step.soft)}>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
