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

const COLORS = ["bg-sun", "bg-sky", "bg-pink", "bg-mint"];
const TILTS = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[1.5deg]"];

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
    <section aria-label="Portfolio metrics" className="py-10">
      <Container>
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              whileHover={{ rotate: 0, y: -4 }}
              className={cn("pop flex flex-col rounded-card p-5 sm:p-6", COLORS[i % COLORS.length], TILTS[i % TILTS.length])}
            >
              <dt className="order-2 mt-1 text-sm font-semibold text-ink/75">{m.label}</dt>
              <dd className="order-1 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
