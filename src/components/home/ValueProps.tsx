"use client";

import { motion } from "framer-motion";
import { Code2, Gauge, LineChart, ShieldCheck } from "lucide-react";
import { Tilt } from "@/components/motion/Tilt";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const props = [
  {
    icon: ShieldCheck,
    title: "Fails loudly, never silently",
    body: "Every build ships with a global error workflow, retries with backoff and idempotent writes. When something fails, your team is alerted immediately and nothing is processed twice.",
    className: "lg:col-span-2",
    iconBg: "bg-coral-tint text-coral-deep",
  },
  {
    icon: Gauge,
    title: "Built for peak volume",
    body: "Queue-mode n8n, horizontal workers, rate-limit aware batching.",
    className: "",
    iconBg: "bg-sky-tint text-sky-deep",
  },
  {
    icon: LineChart,
    title: "Measurable ROI",
    body: "We measure the manual baseline first, then report hours and errors saved.",
    className: "",
    iconBg: "bg-sun-tint text-sun-deep",
  },
  {
    icon: Code2,
    title: "You own everything",
    body: "Version-controlled JSON, documented nodes and a handover runbook. No black boxes and no vendor lock-in.",
    className: "lg:col-span-2",
    iconBg: "bg-mint-tint text-mint-deep",
  },
];

export function ValueProps() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          kicker="How we build"
          kickerClass="bg-coral"
          title="Low-code tooling. Software engineering standards."
          description="Every workflow is built, tested and handed over like production software, because for your business it is."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {props.map(({ icon: Icon, title, body, className, iconBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className={className}
            >
              <Tilt className="pop h-full rounded-card bg-card p-7 transition-shadow duration-300 hover:shadow-pop-lg" max={4}>
              <span
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-pop-sm [transform:translateZ(40px)]",
                  iconBg,
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{body}</p>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
