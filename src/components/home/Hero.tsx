"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Workflow as WorkflowIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const reduce = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="bg-node-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-r from-accent/20 via-logic/20 to-accent/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <motion.div {...fadeUp(0)} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-3 py-1 font-mono text-xs text-fg-muted">
            <WorkflowIcon className="h-3.5 w-3.5 text-accent-strong" aria-hidden />
            Enterprise n8n engineering
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.06)}
          className="mx-auto mt-6 max-w-4xl text-center text-4xl font-semibold tracking-tight text-balance text-fg sm:text-6xl"
        >
          GridNodes: <span className="text-gradient">Production-Ready</span> n8n Automations for Scale.
        </motion.h1>

        <motion.p
          {...fadeUp(0.12)}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-pretty text-fg-muted"
        >
          We design, harden and operate the workflows that move your revenue, finance and operations data — with
          observability, error handling and measurable ROI built in from node one.
        </motion.p>

        <motion.div {...fadeUp(0.18)} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/showroom">
            Explore the Showroom <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Book a Discovery Call
          </ButtonLink>
        </motion.div>
      </Container>
    </section>
  );
}
