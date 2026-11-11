"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { HeroGraph } from "./HeroGraph";

const TEAMS = [
  { label: "sales", color: "bg-coral" },
  { label: "finance", color: "bg-mint" },
  { label: "marketing", color: "bg-pink" },
  { label: "ops", color: "bg-sky" },
] as const;

function RotatingTeam() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % TEAMS.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  const team = TEAMS[i]!;
  return (
    <span className="relative inline-flex align-baseline">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={team.label}
          initial={{ y: "60%", opacity: 0, rotate: -6 }}
          animate={{ y: 0, opacity: 1, rotate: -2 }}
          exit={{ y: "-60%", opacity: 0, rotate: 4 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className={cn("inline-block rounded-lg border-2 border-ink px-2 shadow-pop-sm", team.color)}
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
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 260, damping: 24, delay },
  });

  return (
    <section className="relative overflow-hidden">
      {/* decorative shapes */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sun/60 blur-[2px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 -left-16 h-40 w-40 rotate-12 rounded-[2rem] bg-sky/40" aria-hidden />

      <Container className="relative grid items-center gap-14 pt-14 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-28">
        <div>
          <motion.p {...rise(0)} className="text-base font-semibold text-ink-soft">
            Hi, we&rsquo;re GridNodes 👋
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-4 text-[2.6rem] leading-[1.02] font-extrabold tracking-tight text-ink sm:text-6xl"
          >
            <span className="marker whitespace-nowrap">Production&#8209;ready</span> n8n automations for scale.
          </motion.h1>

          <motion.p {...rise(0.12)} className="mt-6 text-xl leading-snug font-medium text-ink-soft sm:text-2xl">
            Wired up for your <RotatingTeam /> team.
          </motion.p>

          <motion.p {...rise(0.18)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            We build the workflows that quietly move your leads, invoices and content around, with proper error
            handling, logging and numbers you can show your CFO.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/showroom">
              See the workflows <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Book a discovery call
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, rotate: 4, y: 30 }}
          animate={{ opacity: 1, rotate: 1.5, y: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
          className="relative"
        >
          <HeroGraph />
          <span className="absolute -top-5 -left-4 inline-block origin-bottom-left animate-wiggle rounded-full border-2 border-ink bg-sun px-3 py-1 text-sm font-bold shadow-pop-sm">
            ⚡ 9s speed-to-lead
          </span>
          <span className="absolute -right-3 -bottom-5 inline-block -rotate-3 rounded-full border-2 border-ink bg-violet px-3 py-1 text-sm font-bold text-white shadow-pop-sm">
            3 days faster month-end
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
