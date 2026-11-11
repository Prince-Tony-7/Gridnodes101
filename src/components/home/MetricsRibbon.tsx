"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

const ACCENTS = ["bg-coral", "bg-sky", "bg-violet", "bg-mint"];

function formatNumber(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function CountUp({ value, decimals = 0, suffix = "" }: Omit<Metric, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => formatNumber(value, decimals));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(formatNumber(v, decimals)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export function MetricsRibbon({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <section aria-label="Portfolio metrics" className="py-16">
      <Container>
        <dl className="pop grid grid-cols-2 overflow-hidden rounded-card bg-card lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className={cn(
                "flex flex-col border-line p-6 sm:p-8",
                i % 2 === 0 && "border-r",
                i < 2 && "border-b lg:border-b-0",
                i === 1 && "lg:border-r",
                i === 2 && "lg:border-r",
              )}
            >
              <dt className="order-2 mt-2 flex items-center gap-2 text-sm font-medium text-ink-soft">
                <span className={cn("h-1.5 w-1.5 rounded-full", ACCENTS[i % ACCENTS.length])} aria-hidden />
                {m.label}
              </dt>
              <dd className="order-1 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
