"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

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
      duration: 1.4,
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
    <section aria-label="Portfolio metrics" className="border-y border-line bg-surface/60">
      <Container>
        <dl className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-1 px-4 py-8 text-center">
              <dt className="order-2 font-mono text-xs tracking-wider text-fg-subtle uppercase">{m.label}</dt>
              <dd className="order-1 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
