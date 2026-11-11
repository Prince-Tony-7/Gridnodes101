"use client";

import { motion } from "framer-motion";
import { Code2, Gauge, LineChart, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const props = [
  {
    icon: ShieldCheck,
    title: "Breaks loudly, never silently",
    body: "Every build ships with a global error workflow, retries with backoff and idempotent writes. If something fails at 3am, you hear about it, and nothing gets double-charged.",
    className: "bg-coral-tint lg:col-span-2",
    iconBg: "bg-coral",
  },
  {
    icon: Gauge,
    title: "Handles the busy days",
    body: "Queue-mode n8n, horizontal workers, rate-limit aware batching.",
    className: "bg-sky-tint",
    iconBg: "bg-sky",
  },
  {
    icon: LineChart,
    title: "ROI with receipts",
    body: "We measure the manual baseline first, then show you the hours saved.",
    className: "bg-sun-tint",
    iconBg: "bg-sun",
  },
  {
    icon: Code2,
    title: "You own all of it",
    body: "Version-controlled JSON, documented nodes and a handover runbook. No black boxes, no lock-in, no retainer you can't leave.",
    className: "bg-mint-tint lg:col-span-2",
    iconBg: "bg-mint",
  },
];

export function ValueProps() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          kicker="How we build"
          kickerClass="bg-mint"
          title="Low-code, not low standards."
          description="We treat every canvas like real software, because for your team it is."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {props.map(({ icon: Icon, title, body, className, iconBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 220, damping: 24, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className={cn("pop rounded-card p-7", className)}
            >
              <span
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink shadow-pop-sm",
                  iconBg,
                )}
              >
                <Icon className="h-6 w-6 text-ink" strokeWidth={2.25} aria-hidden />
              </span>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
