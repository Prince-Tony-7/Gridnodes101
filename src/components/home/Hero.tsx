"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Tilt } from "@/components/motion/Tilt";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { HeroGraph } from "./HeroGraph";

const PROOF = ["Error alerts, so nothing fails silently", "Documented and handed over to you", "You own the workflows. No lock-in."];

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Gentle parallax as the hero scrolls away: graph drifts up, copy eases out.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const graphY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 50]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);
  const washY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* dot grid, fading out from the top-right */}
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent)]"
      />
      {/* soft colour wash */}
      <motion.div
        style={{ y: washY }}
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[620px] rounded-full opacity-60 blur-3xl"
        aria-hidden
      >
        <div className="h-full w-full" style={{ background: "radial-gradient(closest-side, var(--color-coral-tint), transparent)" }} />
      </motion.div>
      <div
        className="pointer-events-none absolute top-40 right-[25%] h-[360px] w-[420px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-mint-tint), transparent)" }}
        aria-hidden
      />

      <Container className="relative grid items-center gap-14 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-sm font-medium text-ink-soft shadow-pop-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
            Workflow automation for Irish small businesses
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance text-ink sm:text-6xl"
          >
            Stop losing hours to spreadsheets, inboxes and <span className="text-accent whitespace-nowrap">copy&#8209;paste.</span>
          </motion.h1>

          <motion.p {...rise(0.12)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            I build automations that handle the repetitive admin (client intake, reporting, invoicing, email), so your
            team doesn&rsquo;t have to.
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">
              Book a free chat <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/showroom" variant="secondary">
              See example workflows
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

          <motion.p {...rise(0.3)} className="mt-8 text-sm text-ink-mute">
            Built in Dublin by{" "}
            <Link href="/about" className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Prince Tony
            </Link>
            , a process engineer in medical device manufacturing.
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative"
        >
          <motion.div style={{ y: graphY }} className="relative">
          <Tilt className="rounded-card" max={7} spotlight={null}>
            {/* stacked panels behind the canvas */}
            <div
              aria-hidden
              className="absolute inset-x-8 -bottom-6 top-6 rounded-card border border-line bg-card/60 shadow-pop [transform:translateZ(-60px)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-4 -bottom-3 top-3 rounded-card border border-line bg-card/80 shadow-pop [transform:translateZ(-30px)]"
            />
            <div className="relative rounded-card shadow-pop-lg">
              <HeroGraph />
            </div>
          </Tilt>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
