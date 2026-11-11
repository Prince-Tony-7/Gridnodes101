"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { HeroGraph } from "./HeroGraph";

const TEAMS = [
  { label: "Sales", color: "text-coral-deep" },
  { label: "Finance", color: "text-mint-deep" },
  { label: "Marketing", color: "text-pink-deep" },
  { label: "Operations", color: "text-sky-deep" },
] as const;

const PROOF = ["Error handling and alerting built in", "Version-controlled and documented", "ROI measured against your baseline"];

function RotatingTeam() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % TEAMS.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  const team = TEAMS[i]!;
  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={team.label}
          initial={{ y: "40%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-40%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn("inline-block font-semibold", team.color)}
        >
          {team.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section className="relative overflow-hidden">
      {/* soft colour wash */}
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[620px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-violet-tint), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 right-[25%] h-[360px] w-[420px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-sky-tint), transparent)" }}
        aria-hidden
      />

      <Container className="relative grid items-center gap-14 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div>
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-sm font-medium text-ink-soft shadow-pop-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
            n8n automation engineering
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance text-ink sm:text-6xl"
          >
            Production&#8209;ready n8n automations, <span className="text-accent">built for scale.</span>
          </motion.h1>

          <motion.p {...rise(0.12)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            We design, build and maintain the workflows that move leads, invoices and content between your systems, so
            your <RotatingTeam /> team can spend its time on work that needs a person.
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">
              Book a discovery call <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/showroom" variant="secondary">
              Explore the showroom
            </ButtonLink>
          </motion.div>

          <motion.ul {...rise(0.24)} className="mt-10 grid gap-2.5 text-sm text-ink-soft sm:grid-cols-1">
            {PROOF.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint-tint text-mint-deep">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative"
        >
          <HeroGraph />
          <div className="absolute top-16 -left-8 hidden rounded-xl border border-line bg-card px-4 py-3 shadow-pop sm:block">
            <p className="text-xs font-medium text-ink-mute">Median speed-to-lead</p>
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">
              9s <span className="text-sm font-medium text-mint-deep">↓ from 4h</span>
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
